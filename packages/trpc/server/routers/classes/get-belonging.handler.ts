import type { NonNullableUserContext } from "../../lib/types";
import { getBelongingClasses } from "./utils/get-belonging";

type GetBelongingOptions = {
  ctx: NonNullableUserContext;
};

export const getBelongingHandler = async ({ ctx }: GetBelongingOptions) => {
  return await getBelongingClasses(ctx.session.user.id);
};

export default getBelongingHandler;
