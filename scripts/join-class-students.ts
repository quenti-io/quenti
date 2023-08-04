import { PrismaClient } from "@prisma/client";

const NUM_STUDENTS = 25;
const prisma = new PrismaClient();

const main = async () => {
  const classId = process.env.TARGET_CLASS_ID;
  if (!classId) throw new Error("Provide a TARGET_CLASS_ID to join");

  const users = await prisma.user.findMany({
    take: NUM_STUDENTS,
    where: {
      type: "Student",
    },
  });

  await prisma.classMembership.createMany({
    data: users.map((user) => ({
      classId,
      userId: user.id,
      type: "Student",
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
