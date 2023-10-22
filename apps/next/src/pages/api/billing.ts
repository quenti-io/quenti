import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { getServerAuthSession } from "@quenti/auth";
import { APP_URL } from "@quenti/lib/constants/url";
import { getStripeCustomerIdFromUserId, stripe } from "@quenti/payments";

const querySchema = z.object({
  orgId: z.string().cuid2(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) return res.status(401).json({ error: "Unauthorized" });
  if (session.user.type !== "Teacher")
    return res.status(403).json({ error: "Forbidden" });

  const schema = querySchema.safeParse(req.query);
  if (schema.success === false) {
    return res.status(400).json({ error: "Must specify valid return orgId" });
  }
  const orgId = schema.data.orgId;

  const customerId = await getStripeCustomerIdFromUserId(session.user.id);
  if (!customerId)
    return res.status(404).json({ error: "Customer id not found in Stripe" });

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/orgs/${orgId}/billing`,
  });

  return res.redirect(302, stripeSession.url);
}
