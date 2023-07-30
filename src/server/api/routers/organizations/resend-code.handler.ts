import { TRPCError } from "@trpc/server";
import { genOtp } from "../../../lib/otp";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TResendCodeSchema } from "./resend-code.schema";
import { sendConfirmCodeEmail } from "../../../../emails/resend";

type ResentCodeOptions = {
  ctx: NonNullableUserContext;
  input: TResendCodeSchema;
};

export const resendCodeHandler = async ({ ctx, input }: ResentCodeOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  const domain = await ctx.prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId: input.orgId,
    },
  });

  if (!domain || domain.verifiedAt)
    throw new TRPCError({ code: "BAD_REQUEST" });

  const { hash, otp } = genOtp(domain.verifiedEmail);

  await ctx.prisma.verifiedOrganizationDomain.update({
    where: {
      orgId: input.orgId,
    },
    data: {
      otpHash: hash,
    },
  });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
  });

  await sendConfirmCodeEmail(domain.verifiedEmail, {
    domain: domain.requestedDomain,
    orgName: org.name,
    otp,
  });
};

export default resendCodeHandler;
