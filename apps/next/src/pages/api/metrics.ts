import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "@quenti/env/server";
import { register } from "@quenti/trpc/server/prometheus";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const auth = req.headers.authorization;
  // Get username and password from auth
  const [username, password] = Buffer.from(auth?.split(" ")[1] ?? "", "base64")
    .toString()
    .split(":");

  if (
    username !== env.METRICS_API_USER ||
    password !== env.METRICS_API_PASSWORD
  ) {
    res.statusCode = 401;
    return res.end("Unauthorized");
  }

  res.setHeader("Content-Type", register.contentType);
  return res.end(await register.metrics());
}
