import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TEditMemberRoleSchema } from "./edit-member-role.schema";

type EditMemebrRoleOptions = {
  ctx: NonNullableUserContext;
  input: TEditMemberRoleSchema;
};

export const editMemberRoleHandler = async ({
  ctx,
  input,
}: EditMemebrRoleOptions) => {
  const membership = await ctx.prisma.membership.findFirst({
    where: {
      userId: ctx.session.user.id,
      orgId: input.orgId,
      accepted: true,
      OR: [{ role: "Admin" }, { role: "Owner" }],
    },
  });
  if (!membership) throw new TRPCError({ code: "UNAUTHORIZED" });

  if (membership.role == "Member") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Must be an admin to edit member roles",
    });
  }
  if (input.genericId == ctx.session.user.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot change your own role",
    });
  }

  if (membership.role == "Admin" && input.role == "Owner") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Must be an owner to change a user to owner",
    });
  }

  if (input.type == "user") {
    const members = await ctx.prisma.membership.findMany({
      where: {
        orgId: input.orgId,
      },
    });

    const target = members.find((m) => m.userId === input.genericId);
    if (!target) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.membership.update({
      where: {
        userId_orgId: {
          userId: input.genericId,
          orgId: input.orgId,
        },
      },
      data: {
        role: input.role,
      },
    });
  } else {
    const invite = await ctx.prisma.pendingInvite.findUnique({
      where: {
        id: input.genericId,
      },
    });

    if (!invite || invite.orgId !== input.orgId)
      throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.pendingInvite.update({
      where: {
        id: input.genericId,
      },
      data: {
        role: input.role,
      },
    });
  }
};

export default editMemberRoleHandler;