import { TRPCError } from "@trpc/server";

import { getOrgDomains } from "../../lib/orgs/domains";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddStudentSchema } from "./add-student.schema";

type AddStudentOptions = {
  ctx: NonNullableUserContext;
  input: TAddStudentSchema;
};

export const addStudentHandler = async ({ ctx, input }: AddStudentOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  if (input.email == ctx.session.user.email)
    throw new TRPCError({ code: "BAD_REQUEST", message: "cannot_add_self" });

  const domains = await getOrgDomains(input.orgId);

  if (!domains || domains.find((d) => !d.verifiedAt || !d.domain)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "contains_unverified_domains",
    });
  }

  let domain = domains.find((d) => d.type == "Student");
  if (!domain) {
    domain = domains.find((d) => d.type == "Base")!;
  }

  const studentDomain = input.email.split("@")[1]!;
  if (studentDomain !== domain.domain) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "domain_mismatch",
    });
  }

  const student = await ctx.prisma.user.findFirst({
    where: {
      email: input.email,
    },
  });

  if (!student) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "no_account_for_email",
    });
  }

  if (student.organizationId && student.type == "Student") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "student_already_in_org",
    });
  }

  const membership = await ctx.prisma.organizationMembership.findFirst({
    where: {
      userId: student.id,
    },
  });

  if (membership) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "member_in_org",
    });
  }

  await ctx.prisma.user.update({
    where: {
      id: student.id,
    },
    data: {
      organizationId: input.orgId,
      type: "Student",
    },
  });
};

export default addStudentHandler;
