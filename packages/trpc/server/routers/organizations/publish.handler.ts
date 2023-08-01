import { IS_PAYMENT_ENABLED } from "@quenti/lib/constants/payments";
import { BASE_URL } from "@quenti/lib/constants/url";
import { purchaseOrganizationSubscription } from "@quenti/payments";
import { prisma } from "@quenti/prisma";
import { TRPCError } from "@trpc/server";
import { conflictingDomain } from "../../lib/orgs/domains";
import { bulkJoinOrgStudents } from "../../lib/orgs/students";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TPublishSchema } from "./publish.schema";

type PublishOptions = {
  ctx: NonNullableUserContext;
  input: TPublishSchema;
};

export const createCheckoutSession = async (orgId: string, userId: string) => {
  if (!IS_PAYMENT_ENABLED) return;

  const checkoutSession = await purchaseOrganizationSubscription({
    orgId,
    userId,
  });

  if (!checkoutSession.callback) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed retrieving checkout session",
    });
  }

  return { callback: checkoutSession.callback };
};

export const publishHandler = async ({ ctx, input }: PublishOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const org = (await ctx.prisma.organization.findUnique({
    where: { id: input.orgId },
    include: { members: true },
  }))!;

  const checkoutSession = await createCheckoutSession(
    org.id,
    ctx.session.user.id
  );

  if (checkoutSession) return checkoutSession;

  const domain = await prisma.verifiedOrganizationDomain.findUnique({
    where: {
      orgId: org.id,
    },
  });

  if (!domain || !domain.verifiedAt)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Must have a verified domain before publishing",
    });

  if (await conflictingDomain(org.id, domain.requestedDomain)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Domain conflict",
    });
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      published: true,
      domain: {
        update: {
          domain: domain.requestedDomain,
        },
      },
    },
  });

  await bulkJoinOrgStudents(org.id, domain.requestedDomain);

  return {
    callback: `${BASE_URL}/orgs/${org.id}`,
  };
};

export default publishHandler;
