import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddStudentDomainSchema } from "./add-student-domain.schema";
import { env } from "@quenti/env/server";

import all from "email-providers/all.json" assert { type: "json" };
import { RateLimitType, rateLimitOrThrow } from "../../lib/rate-limit";
import { disbandOrgUsersByDomain } from "../../lib/orgs/students";
import { genOtp } from "../../lib/otp";
import { sendConfirmCodeEmail } from "@quenti/emails";

type AddStudentDomainOptions = {
  ctx: NonNullableUserContext;
  input: TAddStudentDomainSchema;
};

export const addStudentDomainHandler = async ({
  ctx,
  input,
}: AddStudentDomainOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  const emailDomain = input.email.split("@")[1];
  if (emailDomain !== input.domain) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "email_domain_mismatch",
    });
  }

  if (env.SERVER_NAME) {
    if (all.find((domain) => domain === input.domain)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "email_domain_blacklisted",
      });
    }
  }

  await rateLimitOrThrow({
    type: RateLimitType.FanOut,
    identifier: `orgs:verify-domain-user-id-${ctx.session.user.id}`,
  });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
  });

  const existingVerified = await ctx.prisma.organizationDomain.findFirst({
    where: {
      domain: input.domain,
    },
  });

  if (existingVerified) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        existingVerified.orgId !== input.orgId
          ? "domain_already_verified"
          : "already_verified_for_organization",
    });
  }

  const existingStudentDomain = await ctx.prisma.organizationDomain.findUnique({
    where: {
      orgId_type: {
        orgId: input.orgId,
        type: "Student",
      },
    },
  });

  if (existingStudentDomain) {
    // Delete the existing domain and disband all students if the organization is published
    await ctx.prisma.organizationDomain.delete({
      where: {
        id: existingStudentDomain.id,
      },
    });

    if (org.published && existingStudentDomain.domain)
      await disbandOrgUsersByDomain(existingStudentDomain.domain);
  }

  const { hash, otp } = genOtp(input.email);

  await ctx.prisma.organizationDomain.create({
    data: {
      orgId: org.id,
      type: "Student",
      otpHash: hash,
      requestedDomain: input.domain,
      verifiedEmail: input.email,
    },
  });

  await sendConfirmCodeEmail(input.email, {
    domain: input.domain,
    orgName: org.name,
    otp,
  });
};

export default addStudentDomainHandler;