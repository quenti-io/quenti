import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../../server/auth";
import { isOrganizationAdmin } from "../../../../server/lib/queries/organizations";
import { IS_PAYMENT_ENABLED } from "../../../../constants/payments";
import { purchaseOrganizationSubscription } from "../../../../payments/subscription";

const querySchema = z.object({
  id: z.string().cuid2(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!IS_PAYMENT_ENABLED) return;

  const session = await getServerAuthSession({ req, res });

  if (!session?.user) return res.status(401).json({ error: "Unauthorized" });
  if (session.user.type !== "Teacher")
    return res.status(403).json({ error: "Forbidden" });

  const schema = querySchema.safeParse(req.query);
  if (schema.success === false) {
    return res.status(400).json({ error: "Must specify valid org id" });
  }
  const orgId = schema.data.id;

  if (!(await isOrganizationAdmin(session.user.id, orgId)))
    return res.status(403).json({ error: "Forbidden" });

  const checkoutSession = await purchaseOrganizationSubscription({
    orgId,
    userId: session.user.id,
  });

  if (!checkoutSession.callback) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }

  return res.redirect(302, checkoutSession.callback);
}
