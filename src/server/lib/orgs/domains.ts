import { prisma } from "../../db";

export const getOrgDomain = async (orgId: string) => {
  return await prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId,
    },
  });
};

export const conflictingDomain = async (orgId: string, domain: string) => {
  return await prisma.verifiedOrganizationDomain.findFirst({
    where: {
      orgId: {
        not: orgId,
      },
      domain,
    },
  });
};

export const deactivateOrgDomain = async (orgId: string) => {
  return await prisma.verifiedOrganizationDomain.update({
    where: {
      orgId,
    },
    data: {
      domain: null,
    },
  });
};
