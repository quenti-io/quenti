import type { NonNullableUserContext } from "../../../lib/types";
import type { TEditRegexSchema } from "./edit-regex.schema";

type EditRegexOptions = {
  ctx: NonNullableUserContext;
  input: TEditRegexSchema;
};

export const editRegexHandler = async ({ ctx, input }: EditRegexOptions) => {
  await ctx.prisma.allowedEmailRegex.update({
    where: {
      regex: input.oldRegex,
    },
    data: {
      regex: input.newRegex,
      label: input.label,
    },
  });
};

export default editRegexHandler;
