import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TRemoveMemberSchema } from "./remove-member.schema";

type RemoveMemberOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveMemberSchema;
};

export const removeMemberHandler = async ({
  ctx,
  input,
}: RemoveMemberOptions) => {
  const membership = await ctx.prisma.membership.findFirst({
    where: {
      userId: ctx.session.user.id,
      orgId: input.orgId,
      accepted: true,
    },
  });
  if (!membership) throw new TRPCError({ code: "UNAUTHORIZED" });

  const members = await ctx.prisma.membership.findMany({
    where: {
      orgId: input.orgId,
    },
  });

  const targetMembership = members.find((m) => m.userId === input.userId);
  if (!targetMembership) throw new TRPCError({ code: "NOT_FOUND" });

  const owners = members.filter((m) => m.role === "Owner");

  if (membership.userId == input.userId) {
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

  if (membership.role == "Admin" && targetMembership.role == "Owner") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Must be an owner to remove an owner",
    });
  }

  await ctx.prisma.membership.delete({
    where: {
      userId_orgId: {
        userId: input.userId,
        orgId: input.orgId,
      },
    },
  });
};

export default removeMemberHandler;
