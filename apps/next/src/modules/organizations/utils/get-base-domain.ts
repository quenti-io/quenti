import type { OrganizationDomain } from "@quenti/prisma/client";

export const getBaseDomain = (
  org: { domains: Partial<OrganizationDomain>[] } | undefined
) => {
  return org?.domains.find((domain) => domain.type == "Base");
};
