import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@quenti/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id as string;

  const set = await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  });

  return res.status(200).json(set);
}
