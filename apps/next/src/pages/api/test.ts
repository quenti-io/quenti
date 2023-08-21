import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@quenti/prisma";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const count = await prisma.user.count();
  return res.status(200).json({ count });
}
