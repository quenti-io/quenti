import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { z } from "zod";

import { getServerAuthSession } from "@quenti/auth";
import { stripe } from "@quenti/payments";
import { prisma } from "@quenti/prisma";
import { upgradeOrganization } from "@quenti/trpc/server/lib/orgs/upgrade";

const querySchema = z.object({
  id: z.string().cuid2(),
  session_id: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, session_id } = querySchema.parse(req.query);

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["subscription"],
  });
  if (!checkoutSession.subscription)
    return res.status(404).json({ error: "Checkout session not found" });

  const subscription = checkoutSession.subscription as Stripe.Subscription;
  if (checkoutSession.payment_status !== "paid")
    return res.status(402).json({ error: "Payment required" });

  let org = await prisma.organization.findFirst({
    where: { metadata: { path: "$.paymentId", equals: session_id } },
  });

  const member = await prisma.organizationMembership.findFirst({
    where: {
      orgId: id,
      metadata: { path: "$.onboardingStep", equals: "publish" },
    },
    select: {
      userId: true,
    },
  });

  if (!org) {
    org = await upgradeOrganization(
      id,
      member?.userId,
      checkoutSession.id,
      subscription.id,
      subscription.items.data[0]?.id,
    );
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) return { message: "Upgraded successfully" };

  res.redirect(302, `/orgs/${org.id}?upgrade=success`);
}
