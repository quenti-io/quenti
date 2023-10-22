import { prisma } from "@quenti/prisma";

export const isOrganizationAdmin = async (userId: string, orgId: string) => {
  return !!(await prisma.organizationMembership.findFirst({
    where: {
      userId,
      orgId,
      OR: [{ role: "Admin" }, { role: "Owner" }],
    },
  }));
};

export const isOrganizationOwner = async (userId: string, orgId: string) => {
  return !!(await prisma.organizationMembership.findFirst({
    where: {
      userId,
      orgId,
      role: "Owner",
    },
  }));
};

export const isOrganizationMember = async (userId: string, orgId: string) => {
  return !!(await prisma.organizationMembership.findFirst({
    where: {
      userId,
      orgId,
    },
  }));
};

export const isInOrganizationBase = async (email: string, orgId: string) => {
  return !!(await prisma.organizationDomain.findFirst({
    where: {
      orgId,
      requestedDomain: email.split("@")[1]!,
      type: "Base",
    },
  }));
};
