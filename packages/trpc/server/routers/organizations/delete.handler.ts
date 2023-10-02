import { inngest } from "@quenti/inngest";
import { cancelOrganizationSubscription } from "@quenti/payments";

import { TRPCError } from "@trpc/server";

import { isOrganizationOwner } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  if (!(await isOrganizationOwner(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
    select: {
      id: true,
      name: true,
      published: true,
      deletedAt: true,
      members: {
        where: {
          role: "Owner",
        },
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (org.deletedAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Organization has already been requested for deletion",
    });
  }

  await ctx.prisma.organization.update({
    where: {
      id: input.orgId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  if (org.published) {
    await inngest.send({
      name: "orgs/delete",
      data: {
        org: {
          id: org.id,
          name: org.name,
        },
        ownerEmails: org.members.map((m) => m.user.email),
      },
    });
  } else {
    await cancelOrganizationSubscription(input.orgId);

    await ctx.prisma.organization.delete({
      where: {
        id: input.orgId,
      },
    });
  }

  return { scheduled: org.published };
};

export default deleteHandler;
