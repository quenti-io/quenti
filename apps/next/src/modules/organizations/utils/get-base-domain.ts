import type { OrganizationDomainType } from "@quenti/prisma/client";

export const getBaseDomain = <T extends { type: OrganizationDomainType }>(
  org: { domains: T[] } | undefined,
) => {
  return org?.domains.find((domain) => domain.type == "Base");
};
