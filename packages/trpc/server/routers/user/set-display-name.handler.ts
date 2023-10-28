import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetDisplayNameSchema } from "./set-display-name.schema";

type SetDisplayNameOptions = {
  ctx: NonNullableUserContext;
  input: TSetDisplayNameSchema;
};

export const setDisplayNameHandler = async ({
  ctx,
  input,
}: SetDisplayNameOptions) => {
  if (!ctx.session.user.name)
    throw new TRPCError({ code: "PRECONDITION_FAILED" });

  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      displayName: input.displayName,
    },
  });
};

export default setDisplayNameHandler;
