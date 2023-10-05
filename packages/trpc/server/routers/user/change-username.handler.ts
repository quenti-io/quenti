import { failsPrecondition } from "@quenti/lib/usernames";

import { TRPCError } from "@trpc/server";

import { importConsole } from "../../../console";
import { usernameProfanity } from "../../common/profanity";
import type { NonNullableUserContext } from "../../lib/types";
import type { TChangeUsernameSchema } from "./change-username.schema";

type ChangeUsernameOptions = {
  ctx: NonNullableUserContext;
  input: TChangeUsernameSchema;
};

export const changeUsernameHandler = async ({
  ctx,
  input,
}: ChangeUsernameOptions) => {
  ctx.req.log.debug("user.changeUsername");

  if (usernameProfanity.exists(input.username)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Username contains profanity.",
    });
  }

  try {
    if (
      failsPrecondition(input.username) ||
      !(await importConsole("index")).usernameAvailable(input.username)
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Username is not available.",
      });
    }
  } catch {}

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
