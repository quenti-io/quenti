import type { NonNullableUserContext } from "../../../lib/types";
import type { TAllowFailedLoginSchema } from "./allow-failed-login.schema";

type AllowFailedLoginOptions = {
  ctx: NonNullableUserContext;
  input: TAllowFailedLoginSchema;
};

export const allowFailedLoginHandler = async ({
  ctx,
  input,
}: AllowFailedLoginOptions) => {
  await ctx.prisma.recentFailedLogin.delete({
    where: {
      email: input.email,
    },
  });

  if (input.allow) {
    await ctx.prisma.whitelistedEmail.create({
      data: {
        email: input.email,
      },
    });
  }
};

export default allowFailedLoginHandler;
