import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TVerifyDomainSchema } from "./verify-domain.schema";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { PrismaClient } from "@prisma/client";

import all from "email-providers/all.json" assert { type: "json" };

type VerifyDomainOptions = {
  ctx: NonNullableUserContext;
  input: TVerifyDomainSchema;
};

const verifyEmailFlow = async (
  prisma: PrismaClient,
  orgId: string,
  email: string,
  domain: string,
  deleteExisting = false
) => {
  // TODO: handle email sending, this method will most likely return a confirmation that an email has been sent

  if (deleteExisting) {
    await prisma.verifiedOrganizationDomain.delete({
      where: {
        orgId,
      },
    });
  }

  return await prisma.verifiedOrganizationDomain.create({
    data: {
      orgId,
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

  if (all.find((domain) => domain === input.domain)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "email_domain_blacklisted",
    });
  }

  const existing = await ctx.prisma.verifiedOrganizationDomain.findFirst({
    where: {
      domain: input.domain,
    },
  });

  if (existing) {
    if (existing.orgId !== input.orgId) {
      // Another organization has already registered this domain, email support to resolve the issue
      throw new TRPCError({
        code: "CONFLICT",
        message: "domain_already_verified",
      });
    } else if (existing.verifiedEmail !== input.email) {
      // Update the organization to use a different domain
      return await verifyEmailFlow(
        ctx.prisma,
        input.orgId,
        input.email,
        input.domain,
        true
      );
    } else {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "already_verified_for_organization",
      });
    }
  }

  return await verifyEmailFlow(
    ctx.prisma,
    input.orgId,
    input.email,
    input.domain
  );
};

export default verifyDomainHandler;
