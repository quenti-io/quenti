import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const numStudents = process.env.STUDENTS
    ? parseInt(process.env.STUDENTS)
    : 25;
  const classId = process.env.TARGET_CLASS_ID;
  if (!classId) throw new Error("Provide a TARGET_CLASS_ID to join");

  const users = await prisma.user.findMany({
    take: numStudents,
    where: {
      type: "Student",
    },
  });

  const reinstate = await prisma.user.findMany({
    where: {
      id: { in: users.map((x) => x.id) },
      classes: {
        some: {
          classId,
          deletedAt: { not: null },
        },
      },
    },
  });

  const reinstateIds = reinstate.map((x) => x.id);

  await prisma.classMembership.updateMany({
    where: {
      userId: { in: reinstateIds },
      classId,
    },
    data: {
      deletedAt: null,
    },
  });

  await prisma.classMembership.createMany({
    data: users
      .filter((x) => !reinstateIds.includes(x.id))
      .map((user) => ({
        classId,
        userId: user.id,
        type: "Student",
        email: user.email,
      })),
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
