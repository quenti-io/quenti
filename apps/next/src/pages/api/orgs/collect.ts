import { Client } from "@upstash/qstash";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { env as clientEnv } from "@quenti/env/client";
import { env as serverEnv } from "@quenti/env/server";
import { prisma } from "@quenti/prisma";

const c = serverEnv.QSTASH_TOKEN
  ? new Client({
      token: serverEnv.QSTASH_TOKEN,
    })
  : null;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const orgs = await prisma.organization.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
    },
  });

  await Promise.all(
    orgs.map(
      ({ id }) =>
        c?.publish({
          url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/api/orgs/${id}/collect`,
        }),
    ),
  );

  res.status(200);
};

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
