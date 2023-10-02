import { prisma } from "@quenti/prisma";
import type { UserType } from "@quenti/prisma/client";

export const bulkJoinOrgUsers = async (
  orgId: string,
  domain: string,
  as?: UserType,
) => {
  return await prisma.user.updateMany({
    where: {
      email: {
        endsWith: `@${domain}`,
      },
    },
    data: {
      organizationId: orgId,
      type: as,
    },
  });
};

export const bulkJoinOrgUsersByFilter = async (
  orgId: string,
  domain: string,
  filter: string,
) => {
  const regex = new RegExp(filter);

  const users = await prisma.user.findMany({
    where: {
      email: {
        endsWith: `@${domain}`,
      },
      orgMembership: {
        isNot: {
          orgId,
        },
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const students = [];
  const teachers = [];

  for (const user of users) {
    const base = user.email.split("@")[0]!;
    if (regex.test(base)) {
      teachers.push(user.id);
    } else {
      students.push(user.id);
    }
  }

  await prisma.user.updateMany({
    where: {
      id: { in: students },
    },
    data: {
      organizationId: orgId,
      type: "Student",
    },
  });
  await prisma.user.updateMany({
    where: {
      id: { in: teachers },
    },
    data: {
      organizationId: orgId,
      type: "Teacher",
    },
  });
};

export const bulkJoinOrgMembersAsTeachers = async (orgId: string) => {
  const members = await prisma.organizationMembership.findMany({
    where: {
      orgId,
    },
    select: {
      userId: true,
    },
  });

  await prisma.user.updateMany({
    where: {
      id: {
        in: members.map((m) => m.userId),
      },
    },
    data: {
      organizationId: orgId,
      type: "Teacher",
    },
  });
};

export const disbandOrgUsersByDomain = async (domain: string) => {
  return await prisma.user.updateMany({
    where: {
      email: {
        endsWith: `@${domain}`,
      },
    },
    data: {
      organizationId: null,
    },
  });
};

export const disbandOrgUsers = async (orgId: string) => {
  return await prisma.user.updateMany({
    where: {
      organizationId: orgId,
    },
    data: {
      organizationId: null,
    },
  });
};
