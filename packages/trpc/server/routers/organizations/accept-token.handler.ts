import { MembershipRole, Prisma } from "@quenti/prisma/client";
import { TRPCError } from "@trpc/server";
import { isInOrganizationBase } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAcceptTokenSchema } from "./accept-token.schema";

type AcceptTokenOptions = {
  ctx: NonNullableUserContext;
  input: TAcceptTokenSchema;
};

export const acceptTokenHandler = async ({
  ctx,
  input,
}: AcceptTokenOptions) => {
  const token = await ctx.prisma.verificationToken.findFirst({
    where: {
      token: input.token,
      OR: [{ expiresInDays: null }, { expires: { gte: new Date() } }],
    },
    include: {
      organization: true,
    },
  });

  if (!token)
    throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
  if (!token.organizationId || !token.organization)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Token is not associated with an organization",
    });

  if (
    !(await isInOrganizationBase(ctx.session.user.email!, token.organizationId))
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "user_not_in_domain",
    });
  }

  try {
    await ctx.prisma.organizationMembership.create({
      data: {
        orgId: token.organizationId,
        userId: ctx.session.user.id,
        role: MembershipRole.Member,
        accepted: false,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already a member of this organization",
        });
      }
    } else throw e;
  }

  return token.organization.name;
};

export default acceptTokenHandler;
