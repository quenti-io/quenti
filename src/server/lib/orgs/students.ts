import { prisma } from "../../db";

export const getJoiningOrgId = async (email: string) => {
  const domain = email.split("@")[1];

  const verifiedDomain = await prisma.verifiedOrganizationDomain.findUnique({
    where: {
      domain,
    },
  });

  return verifiedDomain?.orgId;
};

export const bulkJoinOrgStudents = async (orgId: string, domain: string) => {
  return await prisma.user.updateMany({
    where: {
      email: {
        endsWith: `@${domain}`,
      },
      organizations: {
        none: {
          orgId,
        },
      },
    },
    data: {
      organizationId: orgId,
    },
  });
};

export const disbandOrgStudentsByDomain = async (domain: string) => {
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

export const disbandOrgStudents = async (orgId: string) => {
  return await prisma.user.updateMany({
    where: {
      organizationId: orgId,
    },
    data: {
      organizationId: null,
    },
  });
};
