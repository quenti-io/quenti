import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveMemberSchema } from "./remove-member.schema";

type RemoveMemberOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveMemberSchema;
};

export const removeMemberHandler = async ({
  ctx,
  input,
}: RemoveMemberOptions) => {
  const membership = await ctx.prisma.organizationMembership.findFirst({
    where: {
      userId: ctx.session.user.id,
      orgId: input.orgId,
    },
  });
  if (!membership) throw new TRPCError({ code: "UNAUTHORIZED" });

  const members = await ctx.prisma.organizationMembership.findMany({
    where: {
      orgId: input.orgId,
    },
  });

  const owners = members.filter((m) => m.role === "Owner");

  if (membership.id == input.genericId) {
    if (membership.role == "Owner" && owners.length == 1) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot remove yourself as the only owner of an organization",
      });
    }
  } else if (membership.role == "Member") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Must be an admin to remove other members",
    });
  }

  if (input.type == "user") {
    const targetMembership = members.find((m) => m.id === input.genericId);
    if (!targetMembership) throw new TRPCError({ code: "NOT_FOUND" });

    if (membership.role == "Admin" && targetMembership.role == "Owner") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Must be an owner to remove an owner",
      });
    }

    await ctx.prisma.organizationMembership.delete({
      where: {
        id: input.genericId,
      },
    });
  } else {
    const targetInvite = await ctx.prisma.pendingOrganizationInvite.findUnique({
      where: {
        id: input.genericId,
      },
    });

    if (!targetInvite || targetInvite.orgId !== input.orgId)
      throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.pendingOrganizationInvite.delete({
      where: {
        id: input.genericId,
      },
    });
  }
};

export default removeMemberHandler;
