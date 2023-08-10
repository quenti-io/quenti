import { prisma } from "@quenti/prisma";

export const getOrgDomains = async (orgId: string) => {
  return await prisma.organizationDomain.findMany({
    where: {
      orgId,
    },
  });
};

export const conflictingDomains = async (orgId: string, domains: string[]) => {
  return await prisma.organizationDomain.findMany({
    where: {
      orgId: {
        not: orgId,
      },
      domain: {
        in: domains,
      },
    },
  });
};

export const conflictingDomain = async (orgId: string, domain: string) => {
  return await prisma.organizationDomain.findFirst({
    where: {
      orgId: {
        not: orgId,
      },
      domain,
    },
  });
};

export const deactivateOrgDomains = async (orgId: string) => {
  return await prisma.organizationDomain.updateMany({
    where: {
      orgId,
    },
    data: {
      domain: null,
    },
  });
};
