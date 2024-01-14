import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const assignmentId = process.env.ASSIGNMENT_ID;
  if (!assignmentId)
    throw new Error("Provide ASSIGNMENT_ID to generate submissions");

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      studySet: {
        select: {
          id: true,
          collab: {
            select: {
              minTermsPerUser: true,
            },
          },
          _count: {
            select: {
              terms: {
                where: {
                  ephemeral: false,
                },
              },
            },
          },
        },
      },
      section: {
        select: {
          students: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      },
      submissions: {
        select: {
          member: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!assignment) throw new Error(`No assignment with id '${assignmentId}'`);
  const studySet = assignment.studySet;
  if (!studySet)
    throw new Error(`No study set for assignment '${assignmentId}'`);
  const collab = assignment.studySet?.collab;
  if (!collab) throw new Error(`No collab for assignment '${assignmentId}'`);

  const students = assignment.section.students.map((s) => ({
    memberId: s.id,
    userId: s.userId,
  }));

  let created = 0;
  let counter = assignment.studySet!._count.terms;

  const submitTerms = collab.minTermsPerUser || 3;

  for (const student of students) {
    await prisma.submission.create({
      data: {
        assignmentId: assignmentId,
        memberId: student.memberId,
        startedAt: new Date(),
        submittedAt: new Date(),
        terms: {
          createMany: {
            data: Array.from({ length: submitTerms }).map((_, i) => ({
              word: faker.lorem.sentence(),
              definition: faker.lorem.sentence(),
              authorId: student.userId,
              ephemeral: false,
              studySetId: studySet.id,
              rank: counter + i,
            })),
          },
        },
      },
    });

    await prisma.studySetCollaborator.upsert({
      where: {
        studySetId_userId: {
          studySetId: studySet.id,
          userId: student.userId,
        },
      },
      create: {
        studySetId: studySet.id,
        userId: student.userId,
      },
      update: {},
    });

    counter += submitTerms;
    created++;
  }

  await prisma.studySet.update({
    where: {
      id: studySet.id,
    },
    data: {
      cortexStale: true,
    },
  });

  console.log(`Created ${created} submissions`);
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
