import { disbandOrgUsersByDomain } from "@quenti/enterprise/users";

import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveStudentDomainSchema } from "./remove-student-domain.schema";

type RemoveStudentDomainOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveStudentDomainSchema;
};

export const removeStudentDomainHandler = async ({
  ctx,
  input,
}: RemoveStudentDomainOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const domain = await ctx.prisma.organizationDomain.findUnique({
    where: {
      id: input.domainId,
    },
  });
  if (!domain || domain.orgId !== input.orgId)
    throw new TRPCError({ code: "NOT_FOUND" });
  if (domain.type !== "Student")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only delete student domains",
    });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
    select: {
      published: true,
    },
  });

  await ctx.prisma.organizationDomain.delete({
    where: {
      id: input.domainId,
    },
  });

  if (org.published && domain.domain) {
    await disbandOrgUsersByDomain(domain.domain);
  }
};

export default removeStudentDomainHandler;
