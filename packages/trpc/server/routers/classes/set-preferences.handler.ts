import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetPreferencesSchema } from "./set-preferences.schema";

type SetPreferencesOptions = {
  ctx: NonNullableUserContext;
  input: TSetPreferencesSchema;
};

export const setPreferencesHandler = async ({
  ctx,
  input,
}: SetPreferencesOptions) => {
  const membership = await ctx.prisma.classMembership.findUnique({
    where: {
      classId_userId: {
        classId: input.classId,
        userId: ctx.session.user.id,
      },
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!membership) throw new TRPCError({ code: "NOT_FOUND" });

  await ctx.prisma.classPreferences.upsert({
    where: {
      membershipId: membership.id,
    },
    create: {
      membershipId: membership.id,
      ...input.preferences,
    },
    update: {
      ...input.preferences,
    },
  });
};

export default setPreferencesHandler;
