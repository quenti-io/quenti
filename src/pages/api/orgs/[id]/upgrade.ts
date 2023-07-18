import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { z } from "zod";
import stripe from "../../../../payments/stripe";
import { prisma } from "../../../../server/db";
import { getServerAuthSession } from "../../../../server/auth";
import { orgMetadataSchema } from "../../../../../prisma/zod-schemas";

const querySchema = z.object({
  id: z.string().cuid2(),
  session_id: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  if (!org) {
    const prevOrg = await prisma.organization.findFirstOrThrow({
      where: { id },
    });
    const metadata = orgMetadataSchema.parse(prevOrg.metadata);

    org = await prisma.organization.update({
      where: { id },
      data: {
        metadata: {
          ...metadata,
          paymentId: checkoutSession.id,
          subscriptionId: subscription.id || null,
          subscriptionItemId: subscription.items.data[0]?.id || null,
        },
        published: true,
      },
    });
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) return { message: "Upgraded successfully" };

  res.redirect(302, `/orgs/${org.id}?upgrade=success`);
}
