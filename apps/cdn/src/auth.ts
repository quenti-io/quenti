import * as jose from "jose";

import type { Env } from ".";

export const getSub = async (request: Request, env: Env) => {
  const auth = request.headers.get("Authorization");
  const jwt = auth?.split("Bearer ")[1];
  if (!jwt) return new Response("Unauthorized", { status: 401 });

  const secret = new TextEncoder().encode(env.QUENTI_ENCRYPTION_KEY);
  const result = await jose.jwtVerify(jwt, secret);
  if (!result.payload.sub) return new Response("Unauthorized", { status: 401 });

  return result.payload.sub;
};
