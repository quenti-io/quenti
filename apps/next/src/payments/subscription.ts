import { log } from "next-axiom";
import { orgMetadataSchema } from "../../../../packages/prisma/zod-schemas";
import { BASE_URL } from "../constants/url";
import { env } from "@quenti/env/server";
import { prisma } from "../../../../packages/prisma";
import { getErrorFromUnknown } from "../utils/error";
import { getStripeCustomerIdFromUserId } from "./customer";
import stripe from "./stripe";

interface OrganizationSubscriptionOptions {
  orgId: string;
  userId: string;
}

export const checkRequiresPayment = async (orgId: string) => {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: { metadata: true },
  });
  const metadata = orgMetadataSchema.parse(org.metadata);

  if (!metadata?.paymentId) return { callback: null };
  const session = await stripe.checkout.sessions.retrieve(metadata.paymentId);

  if (session.payment_status !== "paid") return { callback: null };

  return {
    callback: `${BASE_URL}/api/orgs/${orgId}/upgrade?session_id=${metadata.paymentId}`,
  };
};

export const purchaseOrganizationSubscription = async ({
  orgId,
  userId,
}: OrganizationSubscriptionOptions) => {
  const { callback } = await checkRequiresPayment(orgId);
  if (callback) return { callback };

  const customerId = await getStripeCustomerIdFromUserId(userId);
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    success_url: `${BASE_URL}/api/orgs/${orgId}/upgrade?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/orgs/${orgId}`,
    line_items: [
      {
        price: env.STRIPE_ORG_MONTHLY_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_update: {
      address: "auto",
    },
    metadata: {
      orgId,
    },
    subscription_data: {
      metadata: {
        orgId,
      },
    },
  });

  return { callback: session.url };
};

export const cancelOrganizationSubscription = async (orgId: string) => {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: { members: true, metadata: true },
  });

  const metadata = orgMetadataSchema.parse(org.metadata);
  if (!metadata?.subscriptionId) return;

  try {
    const subscription = await stripe.subscriptions.retrieve(
      metadata.subscriptionId
    );
    if (subscription && subscription.status !== "canceled")
      await stripe.subscriptions.cancel(metadata.subscriptionId);
  } catch (e) {
    log.error(getErrorFromUnknown(e).message);
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: {
      metadata: {
        ...metadata,
        paymentId: null,
        subscriptionId: null,
        subscriptionItemId: null,
      },
      published: false,
    },
  });
};
