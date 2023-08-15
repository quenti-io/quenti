import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveStudentSchema } from "./remove-student.schema";

type RemoveStudentOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveStudentSchema;
};

export const removeStudentHandler = async ({
  ctx,
  input,
}: RemoveStudentOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const student = await ctx.prisma.user.findFirst({
    where: {
      id: input.studentId,
      organizationId: input.orgId,
    },
  });

  if (!student)
    throw new TRPCError({
      code: "NOT_FOUND",
    });

  await ctx.prisma.user.update({
    where: {
      id: input.studentId,
    },
    data: {
      organizationId: null,
    },
  });
};

export default removeStudentHandler;
