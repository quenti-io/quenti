import { prisma } from "@quenti/prisma";

import { TRPCError } from "@trpc/server";

export const getClassMember = async (classId: string, userId: string) => {
  return await prisma.classMembership.findUnique({
    where: {
      classId_userId: {
        classId,
        userId,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      classId: true,
      userId: true,
      email: true,
      type: true,
      sectionId: true,
      preferences: {
        select: {
          bannerColor: true,
        },
      },
    },
  });
};

export const getClassOrganizationMember = async (
  classId: string,
  userId: string,
) => {
  return await prisma.organizationMembership.findFirst({
    where: {
      userId,
      AND: {
        organization: {
          classes: {
            some: {
              id: classId,
            },
          },
        },
      },
    },
  });
};

export const isClassTeacherOrThrow = async (
  classId: string,
  userId: string,
  permission: "query" | "mutation" = "query",
) => {
  const member = await getClassMember(classId, userId);
  if (member && member.type == "Teacher") return;

  const orgMember = await getClassOrganizationMember(classId, userId);

  if (orgMember) {
    if (permission === "mutation") {
      if (orgMember.role == "Owner" || orgMember.role == "Admin") return;
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return;
  }

  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });
};
