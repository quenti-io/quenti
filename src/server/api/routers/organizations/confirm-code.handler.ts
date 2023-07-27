import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TConfirmCodeSchema } from "./confirm-code.schema";
import {} from "next-auth/core";
import { verifyOtp } from "../../../lib/otp";

type ConfirmCodeOptions = {
  ctx: NonNullableUserContext;
  input: TConfirmCodeSchema;
};

// TODO: rate limiting
export const confirmCodeHandler = async ({
  ctx,
  input,
}: ConfirmCodeOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const domain = await ctx.prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId: input.orgId,
    },
  });

  if (!domain || !domain.otpHash) throw new TRPCError({ code: "BAD_REQUEST" });
  if (!verifyOtp(domain.verifiedEmail, input.code, domain.otpHash))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await ctx.prisma.verifiedOrganizationDomain.update({
    where: {
      orgId: input.orgId,
    },
    data: {
      verifiedAt: new Date(),
    },
  });
};

export default confirmCodeHandler;
