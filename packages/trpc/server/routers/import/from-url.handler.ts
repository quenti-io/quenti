import { importIntegration } from "../../../integrations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TFromUrlSchema } from "./from-url.schema";

type FromUrlOptions = {
  ctx: NonNullableUserContext;
  input: TFromUrlSchema;
};

type Return = {
  importFromUrl: (
    url: string,
    userId: string,
  ) => Promise<{ createdSetId: string; title: string; terms: number }>;
};

export const fromUrlHandler = async ({ ctx, input }: FromUrlOptions) => {
  const { importFromUrl } = (await importIntegration("quizlet")) as Return;
  return await importFromUrl(input.url, ctx.session.user.id);
};

export default fromUrlHandler;
