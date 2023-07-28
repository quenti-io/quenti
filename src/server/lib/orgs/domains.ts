import { prisma } from "../../db";

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
