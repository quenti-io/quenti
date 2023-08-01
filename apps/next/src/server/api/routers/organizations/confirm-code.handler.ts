import { TRPCError } from "@trpc/server";
import { getIp } from "../../../lib/get-ip";
import { bulkJoinOrgStudents } from "../../../lib/orgs/students";
import { verifyOtp } from "../../../lib/otp";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import {
  RateLimitType,
  rateLimitOrThrowMultiple,
} from "../../../lib/rate-limit";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TConfirmCodeSchema } from "./confirm-code.schema";

type ConfirmCodeOptions = {
  ctx: NonNullableUserContext;
  input: TConfirmCodeSchema;
};

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

  const result = verifyOtp(domain.verifiedEmail, input.code, domain.otpHash);
  if (result.expired) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "code_expired",
    });
  }

  await rateLimitOrThrowMultiple({
    type: RateLimitType.Verify,
    identifiers: [
      // We don't want to block genuine attempts to verify a domain, so we can't use just the domain as the identifier
      `orgs:confirm-code-org-id-${domain.orgId}-${domain.requestedDomain}`,
      // Prevents the same user from creating new orgs trying to verify the same domain
      `orgs:confirm-code-user-id-${ctx.session.user.id}-${domain.requestedDomain}`,
      // Rate limit by IP
      `orgs:confirm-code-ip-${getIp(ctx.req)}-${domain.requestedDomain}`,
    ],
  });

  if (!result.success) throw new TRPCError({ code: "UNAUTHORIZED" });

  const existingVerified =
    await ctx.prisma.verifiedOrganizationDomain.findUnique({
      where: {
        domain: domain.requestedDomain,
      },
    });

  if (existingVerified && existingVerified.orgId !== input.orgId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "domain_already_verified",
    });
  }

  const published = (await ctx.prisma.organization.findUnique({
    where: {
      id: input.orgId,
    },
    select: {
      published: true,
    },
  }))!.published;

  await ctx.prisma.verifiedOrganizationDomain.update({
    where: {
      orgId: input.orgId,
    },
    data: {
      verifiedAt: new Date(),
      domain: published ? domain.requestedDomain : null,
    },
  });

  if (published) {
    await bulkJoinOrgStudents(input.orgId, domain.requestedDomain);
  }
};

export default confirmCodeHandler;
