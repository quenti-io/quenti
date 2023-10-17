import { verifySignature } from "@upstash/qstash/dist/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { collectOrganizationActivity } from "@quenti/enterprise/analytics";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  await collectOrganizationActivity(id);

  return res.status(200).json({ id });
};

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
