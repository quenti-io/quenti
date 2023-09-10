import * as jose from "jose";

import type { Env } from ".";

export const handler = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  if (request.method !== "PUT")
    return new Response("Method not allowed", { status: 405 });

  const auth = request.headers.get("Authorization");
  const jwt = auth?.split("Bearer ")[1];
  if (!jwt) return new Response("Unauthorized", { status: 401 });

  const secret = new TextEncoder().encode(env.QUENTI_ENCRYPTION_KEY);
  // @ts-expect-error No overload matches this call
  const result = await jose.jwtVerify(jwt, secret);
  if (!result.payload.sub) return new Response("Unauthorized", { status: 401 });

  // Make sure the body isn't over 5 MB
  const body = await request.arrayBuffer();
  if (body.byteLength > 5 * 1024 * 1024)
    return new Response("File too large", { status: 413 });

  const userId = result.payload.sub;
  const key = `${userId}/avatar/${Date.now()}.png`;

  await env.USERS_BUCKET.put(key, body, {
    httpMetadata: {
      cacheControl: "public, max-age=31536000",
      contentType: "image/png",
    },
  });

  return new Response("OK", { status: 200 });
};
