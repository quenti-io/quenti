import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const org = await ctx.prisma.organization.findFirst({
    where: {
      id: input.id,
      members: {
        some: {
          userId: ctx.session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              email: true,
              // TODO: include classes
            },
          },
        },
      },
      inviteToken: {
        select: {
          token: true,
          expires: true,
          expiresInDays: true,
        },
      },
      domain: {
        select: {
          domain: true,
          requestedDomain: true,
          verifiedAt: true,
          verifiedEmail: true,
        },
      },
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  if (!org) throw new TRPCError({ code: "NOT_FOUND" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { metadata: _, ...rest } = org;
  return rest;
};

export default getHandler;
