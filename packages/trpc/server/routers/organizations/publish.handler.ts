import { IS_PAYMENT_ENABLED } from "@quenti/lib/constants/payments";
import { APP_URL } from "@quenti/lib/constants/url";
import { purchaseOrganizationSubscription } from "@quenti/payments";

import { TRPCError } from "@trpc/server";

import { conflictingDomains, getOrgDomains } from "../../lib/orgs/domains";
import { upgradeOrganization } from "../../lib/orgs/upgrade";
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

  const domains = await getOrgDomains(org.id);
  if (!domains.length || domains.find((d) => !d.verifiedAt))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "All domains must be verified before publishing",
    });

  const conflicting = await conflictingDomains(
    org.id,
    domains.map((d) => d.requestedDomain),
  );
  if (!!conflicting.length) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Conflicting domains",
    });
  }

  const checkoutSession = await createCheckoutSession(
    org.id,
    ctx.session.user.id,
  );

  if (checkoutSession) return checkoutSession;

  await upgradeOrganization(org.id, ctx.session.user.id);

  return {
    callback: `${APP_URL}/orgs/${org.id}?upgrade=success`,
  };
};

export default publishHandler;
