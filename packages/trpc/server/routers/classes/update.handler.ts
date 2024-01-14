import { inngest } from "@quenti/inngest";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUpdateSchema } from "./update.schema";

type UpdateOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  await isClassTeacherOrThrow(input.id, ctx.session.user.id);

  const currentName = await ctx.prisma.class.findUniqueOrThrow({
    where: {
      id: input.id,
    },
    select: {
      name: true,
    },
  });

  const updated = await ctx.prisma.class.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      description: input.description,
      bannerColor: input.bannerColor,
      ...(input.clearLogo
        ? {
            logoUrl: null,
            logoHash: null,
          }
        : {}),
    },
  });

  if (currentName.name !== updated.name)
    await inngest.send({
      name: "cortex/classify-class",
      data: {
        classId: updated.id,
        name: updated.name,
      },
    });

  return updated;
};

export default updateHandler;
