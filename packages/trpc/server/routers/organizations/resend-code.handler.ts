import { TRPCError } from "@trpc/server";

import { sendConfirmCodeEmail } from "../../../../emails/resend";
import { getIp } from "../../lib/get-ip";
import { genOtp } from "../../lib/otp";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TResendCodeSchema } from "./resend-code.schema";

type ResentCodeOptions = {
  ctx: NonNullableUserContext;
  input: TResendCodeSchema;
};

export const resendCodeHandler = async ({ ctx, input }: ResentCodeOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  const domain = await ctx.prisma.organizationDomain.findUnique({
    where: {
      orgId_type: {
        orgId: input.orgId,
        type: "Student",
      },
    },
  });

  if (!domain || domain.verifiedAt || !domain.otpHash)
    throw new TRPCError({ code: "BAD_REQUEST" });

  await rateLimitOrThrowMultiple({
    type: RateLimitType.Strict,
    identifiers: [
      `orgs:resend-code-org-id-${domain.orgId}-${domain.requestedDomain}`,
      `orgs:resend-code-user-id-${ctx.session.user.id}-${domain.requestedDomain}`,
      `orgs:resend-code-ip-${getIp(ctx.req)}-${domain.requestedDomain}`,
    ],
  });

  const { hash, otp } = genOtp(domain.verifiedEmail);

  await ctx.prisma.organizationDomain.update({
    where: {
      orgId_type: {
        orgId: input.orgId,
        type: "Student",
      },
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
