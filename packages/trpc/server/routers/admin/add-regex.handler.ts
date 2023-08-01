import type { NonNullableUserContext } from "../../lib/types";
import type { TAddRegexSchema } from "./add-regex.schema";

type AddRegexOptions = {
  ctx: NonNullableUserContext;
  input: TAddRegexSchema;
};

export const addRegexHandler = async ({ ctx, input }: AddRegexOptions) => {
  await ctx.prisma.allowedEmailRegex.create({
    data: {
      regex: input.regex,
      label: input.label,
    },
  });
};

export default addRegexHandler;
