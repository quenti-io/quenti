import { Client } from "@upstash/qstash";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { env as clientEnv } from "@quenti/env/client";
import { env as serverEnv } from "@quenti/env/server";
import { prisma } from "@quenti/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!serverEnv.QSTASH_TOKEN) return res.status(204);

  const orgs = await prisma.organization.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
    },
  });

  const c = new Client({
    token: serverEnv.QSTASH_TOKEN,
  });

  await Promise.all(
    orgs.map(({ id }) =>
      c.publish({
        url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/api/orgs/${id}/collect`,
      }),
    ),
  );

  res.status(200).json({ ids: orgs.map(({ id }) => id) });
};

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
