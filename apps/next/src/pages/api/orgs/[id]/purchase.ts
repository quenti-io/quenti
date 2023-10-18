import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { getServerAuthSession } from "@quenti/auth";
import { IS_PAYMENT_ENABLED } from "@quenti/lib/constants/payments";
import { APP_URL } from "@quenti/lib/constants/url";
import { purchaseOrganizationSubscription } from "@quenti/payments";
import {
  conflictingDomains,
  getOrgDomains,
} from "@quenti/trpc/server/lib/orgs/domains";
import { isOrganizationAdmin } from "@quenti/trpc/server/lib/queries/organizations";

const querySchema = z.object({
  id: z.string().cuid2(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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

  const domains = await getOrgDomains(orgId);
  if (!domains.length)
    return res
      .status(400)
      .json({ error: "Organization missing verified domain" });

  const conflicting = await conflictingDomains(
    orgId,
    domains.map((d) => d.requestedDomain),
  );
  if (!!conflicting.length)
    return res.status(409).json({ error: "Conflicting domains" });

  const checkoutSession = await purchaseOrganizationSubscription({
    orgId,
    userId: session.user.id,
    cancelUrl: `${APP_URL}/orgs/${orgId}/billing`,
  });

  if (!checkoutSession.callback) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }

  return res.redirect(302, checkoutSession.callback);
}
