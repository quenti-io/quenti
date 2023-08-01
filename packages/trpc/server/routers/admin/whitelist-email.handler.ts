import type { NonNullableUserContext } from "../../lib/types";
import type { TWhitelistEmailSchema } from "./whitelist-email.schema";

type WhitelistEmailOptions = {
  ctx: NonNullableUserContext;
  input: TWhitelistEmailSchema;
};

export const whitelistEmailHandler = async ({
  ctx,
  input,
}: WhitelistEmailOptions) => {
  if (!input.delete) {
    await ctx.prisma.whitelistedEmail.create({
      data: {
        email: input.email,
      },
    });
  } else {
    await ctx.prisma.whitelistedEmail.delete({
      where: {
        email: input.email,
      },
    });
  }
};

export default whitelistEmailHandler;
