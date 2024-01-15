import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveUserSchema } from "./remove-user.schema";

type RemoveUserOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveUserSchema;
};

export const removeUserHandler = async ({ ctx, input }: RemoveUserOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (input.userId == ctx.session.user.id)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot remove yourself",
    });

  const user = await ctx.prisma.user.findFirst({
    where: {
      id: input.userId,
      organizationId: input.orgId,
    },
    select: {
      orgMembership: {
        select: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
    });

  if (user.orgMembership && user.orgMembership.organization.id == input.orgId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "user_is_org_member",
    });
  }

  await ctx.prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      organizationId: null,
    },
  });

  await ctx.prisma.classMembership.updateMany({
    where: {
      class: {
        orgId: input.orgId,
      },
    },
    data: {
      deletedAt: null,
    },
  });
};

export default removeUserHandler;
