import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TPublishSchema } from "./publish.schema";
import { prisma } from "../../../db";
import { IS_PAYMENT_ENABLED } from "../../../../constants/payments";
import { purchaseOrganizationSubscription } from "../../../../payments/subscription";
import { BASE_URL } from "../../../../constants/url";

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

  // TODO: handle auto join domain, conflicts, etc.
  await prisma.organization.update({
    where: { id: org.id },
    data: {
      published: true,
    },
  });

  return {
    callback: `${BASE_URL}/orgs/${org.id}`,
  };
};

export default publishHandler;
