import {
  bulkJoinOrgMembersAsTeachers,
  bulkJoinOrgUsers,
  bulkJoinOrgUsersByFilter,
} from "@quenti/enterprise/users";
import { prisma } from "@quenti/prisma";
import { orgMetadataSchema } from "@quenti/prisma/zod-schemas";

import { bulkJoinOrgClasses } from "./classes";
import { conflictingDomains } from "./domains";

export const upgradeOrganization = async (
  id: string,
  userId?: string,
  paymentId?: string,
  subscriptionId?: string,
  subscriptionItemId?: string,
) => {
  const prevOrg = await prisma.organization.findFirstOrThrow({
    where: { id },
    include: { domains: true },
  });
  const metadata = orgMetadataSchema.parse(prevOrg.metadata);

  const org = await prisma.organization.update({
    where: { id },
    data: {
      metadata: {
        ...metadata,
        paymentId,
        subscriptionId: subscriptionId || null,
        subscriptionItemId: subscriptionItemId || null,
      },
      published: true,
    },
  });

  const conflicting = await conflictingDomains(
    id,
    prevOrg.domains.map((d) => d.requestedDomain),
  );

  for (const domain of prevOrg.domains) {
    if (conflicting.find((x) => x.domain == domain.requestedDomain)) continue;
    const result = await prisma.organizationDomain.update({
      where: { id: domain.id },
      data: { domain: domain.requestedDomain },
    });

    if (result.domain)
      if (result.filter) {
        await bulkJoinOrgUsersByFilter(org.id, result.domain, result.filter);
      } else {
        await bulkJoinOrgUsers(
          org.id,
          result.domain,
          result.type == "Student" ? "Student" : undefined,
        );
      }
  }

  await bulkJoinOrgMembersAsTeachers(org.id);
  await bulkJoinOrgClasses(org.id);

  try {
    await prisma.organizationMembership.update({
      where: {
        userId,
      },
      data: {
        metadata: {
          onboardingStep: null,
        },
      },
    });
  } catch {}

  return org;
};
