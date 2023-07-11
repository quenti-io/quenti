import type { NonNullableUserContext } from "../../../lib/types";
import type { TSetEnableUsageDataSchema } from "./set-enable-usage-data.schema";

type SetEnableUsageDataOptions = {
  ctx: NonNullableUserContext;
  input: TSetEnableUsageDataSchema;
};

export const setEnableUsageDataHandler = async ({
  ctx,
  input,
}: SetEnableUsageDataOptions) => {
  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      enableUsageData: input.enableUsageData,
    },
  });
};

export default setEnableUsageDataHandler;
