import { prisma } from "@quenti/prisma";

export const getClassMember = async (classId: string, userId: string) => {
  return await prisma.classMembership.findUnique({
    where: {
      classId_userId: {
        classId,
        userId,
      },
    },
  });
};
