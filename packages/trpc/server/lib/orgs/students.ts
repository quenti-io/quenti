import { prisma } from "@quenti/prisma";
import type { UserType } from "@quenti/prisma/client";

export const bulkJoinOrgUsers = async (
  orgId: string,
  domain: string,
  as?: UserType
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
