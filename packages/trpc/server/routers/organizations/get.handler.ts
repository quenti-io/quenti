import { TRPCError } from "@trpc/server";

import { conflictingDomains } from "../../lib/orgs/domains";
import type { NonNullableUserContext } from "../../lib/types";
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
            },
          },
        },
      },
      pendingInvites: {
        select: {
          id: true,
          email: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              email: true,
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
      domains: {
        select: {
          id: true,
          type: true,
          domain: true,
          requestedDomain: true,
          verifiedAt: true,
          verifiedEmail: true,
          filter: true,
        },
      },
    },
  });

  if (!org) throw new TRPCError({ code: "NOT_FOUND" });

  const conflicting = await conflictingDomains(
    org.id,
    org.domains.map((d) => d.requestedDomain),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { metadata: _, ...rest } = org;
  return {
    ...rest,
    domains: org.domains.map((d) => ({
      ...d,
      conflicting: !!conflicting.find((c) => c.domain === d.requestedDomain),
    })),
  };
};

export default getHandler;
