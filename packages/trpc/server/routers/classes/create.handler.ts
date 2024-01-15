import { inngest } from "@quenti/inngest";
import { randomBannerColor } from "@quenti/lib/color";
import { EnabledFeature } from "@quenti/lib/feature";

import { TRPCError } from "@trpc/server";

import { hasFeature } from "../../common/feature";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const orgId = ctx.session.user.organizationId;

  if (
    !orgId &&
    !hasFeature(EnabledFeature.EarlyClassAccess, ctx.session.user.flags)
  )
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Classes are not yet supported for personal accounts",
    });

  const created = await ctx.prisma.class.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      bannerColor: randomBannerColor(),
      orgId,
      members: {
        create: {
          type: "Teacher",
          email: ctx.session.user.email!,
          userId: ctx.session.user.id,
        },
      },
    },
  });

  await inngest.send({
    name: "cortex/classify-class",
    data: {
      classId: created.id,
      name: created.name,
    },
  });

  return created;
};

export default createHandler;
