import type { Env } from ".";
import { getSub } from "./auth";

export const handler = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const sub = await getSub(request, env);
  if (sub instanceof Response) return sub;

  // Make sure the body isn't over 5 MB
  const body = await request.arrayBuffer();
  if (body.byteLength > 5 * 1024 * 1024)
    return new Response("File too large", { status: 413 });

  const userId = sub;
  const key = `${userId}/avatar/${Date.now()}`;

  await env.USERS_BUCKET.put(key, body, {
    httpMetadata: {
      cacheControl: "public, max-age=31536000",
      contentType: "image/png",
    },
  });

  return new Response("OK", { status: 200 });
};
