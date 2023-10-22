import { orgMembershipMetadata } from "@quenti/prisma/zod-schemas";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetMemberMetadataSchema } from "./set-member-metadata.schema";

type SetMemberMetadataOptions = {
  ctx: NonNullableUserContext;
  input: TSetMemberMetadataSchema;
};

export const setMemberMetadataHandler = async ({
  ctx,
  input,
}: SetMemberMetadataOptions) => {
  const member = await ctx.prisma.organizationMembership.findUnique({
    where: {
      userId: ctx.session.user.id,
    },
  });
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: member.orgId,
    },
    select: {
      published: true,
    },
  });
  const metadata = orgMembershipMetadata.parse(input.metadata);
  if (org.published) {
    metadata.onboardingStep = null;
  }

  await ctx.prisma.organizationMembership.update({
    where: {
      userId: ctx.session.user.id,
    },
    data: {
      metadata,
    },
  });
};

export default setMemberMetadataHandler;
