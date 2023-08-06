import { prisma } from "@quenti/prisma";
import { TRPCError } from "@trpc/server";

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

export const isClassTeacherOrThrow = async (
  classId: string,
  userId: string
) => {
  const member = await getClassMember(classId, userId);
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });
};
