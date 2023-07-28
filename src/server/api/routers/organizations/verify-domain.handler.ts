import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TVerifyDomainSchema } from "./verify-domain.schema";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { PrismaClient } from "@prisma/client";

import all from "email-providers/all.json" assert { type: "json" };
import { genOtp } from "../../../lib/otp";
import { disbandOrgStudentsByDomain } from "../../../lib/orgs/students";

type VerifyDomainOptions = {
  ctx: NonNullableUserContext;
  input: TVerifyDomainSchema;
};

const verifyEmailFlow = async (
  prisma: PrismaClient,
  orgId: string,
  email: string,
  domain: string,
  published: boolean,
  deleteExisting = false
) => {
  if (deleteExisting) {
    const result = await prisma.verifiedOrganizationDomain.delete({
      where: {
        orgId,
      },
    });

    if (result && published) await disbandOrgStudentsByDomain(result.domain!);
  }

  const { hash, otp } = genOtp(email);

  // TODO: send email with otp
  console.log("OTP:", otp);

  await prisma.verifiedOrganizationDomain.create({
    data: {
      orgId,
      otpHash: hash,
      requestedDomain: domain,
      verifiedEmail: email,
    },
  });
};

export const verifyDomainHandler = async ({
  ctx,
  input,
}: VerifyDomainOptions) => {
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

  // if (all.find((domain) => domain === input.domain)) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     message: "email_domain_blacklisted",
  //   });
  // }

  const org = (await ctx.prisma.organization.findUnique({
    where: {
      id: input.orgId,
    },
  }))!;

  const existingVerified =
    await ctx.prisma.verifiedOrganizationDomain.findFirst({
      where: {
        domain: input.domain,
      },
    });

  if (existingVerified) {
    if (existingVerified.orgId !== input.orgId) {
      // Another organization has already registered this domain, email support to resolve the issue
      throw new TRPCError({
        code: "CONFLICT",
        message: "domain_already_verified",
      });
    } else if (existingVerified.requestedDomain !== input.domain) {
      // Update the organization to use a different domain
      return await verifyEmailFlow(
        ctx.prisma,
        input.orgId,
        input.email,
        input.domain,
        org.published,
        true
      );
    } else {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "already_verified_for_organization",
      });
    }
  }

  const existing = await ctx.prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId: input.orgId,
    },
    select: {
      id: true,
    },
  });

  return await verifyEmailFlow(
    ctx.prisma,
    input.orgId,
    input.email,
    input.domain,
    org.published,
    !!existing
  );
};

export default verifyDomainHandler;
