import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveRegexSchema } from "./remove-regex.schema";

type RemoveRegexOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveRegexSchema;
};

export const removeRegexHandler = async ({
  ctx,
  input,
}: RemoveRegexOptions) => {
  await ctx.prisma.allowedEmailRegex.delete({
    where: {
      regex: input.regex,
    },
  });
};

export default removeRegexHandler;
