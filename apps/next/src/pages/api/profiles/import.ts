import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { env } from "@quenti/env/server";
import { inngest } from "@quenti/inngest";

const schema = z.object({
  userId: z.string().cuid2(),
  username: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (
    !env.ADMIN_WEBHOOK_SECRET ||
    authHeader !== `Bearer ${env.ADMIN_WEBHOOK_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const data = schema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  await inngest.send({
    name: "integrations/quizlet/import-profile",
    data: {
      userId: data.data.userId,
      username: data.data.username,
    },
  });

  return res.status(200).json({ started: true });
}
