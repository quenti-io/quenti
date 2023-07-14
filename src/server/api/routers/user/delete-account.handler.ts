import { TRPCError } from "@trpc/server";
import { env } from "../../../../env/server.mjs";
import type { NonNullableUserContext } from "../../../lib/types";

type DeleteAccountOptions = {
  ctx: NonNullableUserContext;
};

export const deleteAccountHandler = async ({ ctx }: DeleteAccountOptions) => {
  ctx.req.log.debug("user.deleteAccount");

  if (ctx.session.user.email == env.ADMIN_EMAIL) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to delete admin account.",
    });
  }
  // TODO: Remove this
  if (ctx.session.user.username.toLowerCase() == "quenti") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to delete official account.",
    });
  }

  await ctx.prisma.user.delete({
    where: {
      id: ctx.session.user.id,
    },
  });
};

export default deleteAccountHandler;
