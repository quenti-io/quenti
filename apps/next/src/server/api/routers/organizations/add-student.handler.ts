import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
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

  const domain = await ctx.prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId: input.orgId,
    },
  });

  if (!domain || !domain.domain) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "no_verified_domain",
    });
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

  if (student.organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "student_already_in_org",
    });
  }

  const membership = await ctx.prisma.membership.findFirst({
    where: {
      userId: student.id,
      orgId: input.orgId,
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
    },
  });
};

export default addStudentHandler;
