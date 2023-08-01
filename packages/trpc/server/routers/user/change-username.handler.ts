import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TChangeUsernameSchema } from "./change-username.schema";
import { usernameProfanity } from "../../common/profanity";

type ChangeUsernameOptions = {
  ctx: NonNullableUserContext;
  input: TChangeUsernameSchema;
};

export const changeUsernameHandler = async ({
  ctx,
  input,
}: ChangeUsernameOptions) => {
  ctx.req.log.debug("user.changeUsername");

  if (ctx.session.user.username.toLowerCase() == "quenti") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to change official account username.",
    });
  }
  if (usernameProfanity.exists(input.username)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Username contains profanity.",
    });
  }

  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      username: input.username,
    },
  });
};

export default changeUsernameHandler;
