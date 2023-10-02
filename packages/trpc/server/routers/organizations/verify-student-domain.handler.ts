import { bulkJoinOrgUsers } from "@quenti/enterprise/users";

import { TRPCError } from "@trpc/server";

import { getIp } from "../../lib/get-ip";
import { verifyOtp } from "../../lib/otp";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TVerifyStudentDomainSchema } from "./verify-student-domain.schema";

type VerifyStudentDomainOptions = {
  ctx: NonNullableUserContext;
  input: TVerifyStudentDomainSchema;
};

export const verifyStudentDomainHandler = async ({
  ctx,
  input,
}: VerifyStudentDomainOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const domain = await ctx.prisma.organizationDomain.findUnique({
    where: {
      orgId_type: {
        orgId: input.orgId,
        type: "Student",
      },
    },
  });

  if (!domain || !domain.otpHash || domain.verifiedAt)
    throw new TRPCError({ code: "BAD_REQUEST" });

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

  const result = verifyOtp(domain.verifiedEmail, input.code, domain.otpHash);
  if (result.expired) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "code_expired",
    });
  }
  if (!result.success) throw new TRPCError({ code: "UNAUTHORIZED" });

  const existingVerified = await ctx.prisma.organizationDomain.findUnique({
    where: {
      domain: domain.requestedDomain,
    },
  });

  if (existingVerified) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "domain_already_verified",
    });
  }

  const published = (
    await ctx.prisma.organization.findUnique({
      where: {
        id: input.orgId,
      },
      select: {
        published: true,
      },
    })
  )?.published;

  await ctx.prisma.organizationDomain.update({
    where: {
      orgId_type: {
        orgId: input.orgId,
        type: "Student",
      },
    },
    data: {
      // Mark the domain as verified, but only set the unique column if the org is published
      verifiedAt: new Date(),
      domain: published ? domain.requestedDomain : null,
    },
  });

  if (published)
    await bulkJoinOrgUsers(input.orgId, domain.requestedDomain, "Student");

  return { domain: domain.requestedDomain };
};

export default verifyStudentDomainHandler;
