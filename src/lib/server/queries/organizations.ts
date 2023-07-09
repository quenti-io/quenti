import { prisma } from "../../../server/db";

export const isOrganizationAdmin = async (userId: string, orgId: string) => {
  return !!(await prisma.membership.findFirst({
    where: {
      userId,
      orgId,
      accepted: true,
      OR: [{ role: "Admin" }, { role: "Owner" }],
    },
  }));
};

export const isOrganizationOwner = async (userId: string, orgId: string) => {
  return !!(await prisma.membership.findFirst({
    where: {
      userId,
      orgId,
      accepted: true,
      role: "Owner",
    },
  }));
};

export const isOrganizationMember = async (userId: string, orgId: string) => {
  return !!(await prisma.membership.findFirst({
    where: {
      userId,
      orgId,
      accepted: true,
    },
  }));
};
