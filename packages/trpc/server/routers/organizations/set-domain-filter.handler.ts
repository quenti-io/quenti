import { bulkJoinOrgUsersByFilter } from "@quenti/enterprise/users";

import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TSetDomainFilterSchema } from "./set-domain-filter.schema";

type SetDomainFilterOptions = {
  ctx: NonNullableUserContext;
  input: TSetDomainFilterSchema;
};

export const setDomainFilterHandler = async ({
  ctx,
  input,
}: SetDomainFilterOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const domain = await ctx.prisma.organizationDomain.findUnique({
    where: {
      id: input.domainId,
    },
  });

  if (!domain || domain.orgId !== input.orgId)
    throw new TRPCError({ code: "NOT_FOUND" });
  if (domain.type !== "Base")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only set filter on base domains",
    });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
    select: {
      published: true,
    },
  });

  await ctx.prisma.organizationDomain.update({
    where: {
      id: input.domainId,
    },
    data: {
      filter: input.filter,
    },
  });

  if (org.published && domain.domain && input.filter)
    await bulkJoinOrgUsersByFilter(input.orgId, domain.domain, input.filter);
};

export default setDomainFilterHandler;
