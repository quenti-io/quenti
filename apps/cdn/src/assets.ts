import type { Env } from ".";
import { getSub } from "./auth";

export const handler = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const sub = await getSub(request, env);
  if (sub instanceof Response) return sub;

  const body = await request.arrayBuffer();
  if (body.byteLength > 10 * 1024 * 1024)
    return new Response("File too large", { status: 413 });

  await env.ASSETS_BUCKET.put(sub, body, {
    httpMetadata: {
      cacheControl: "s-maxage=300 stale-while-revalidate=59",
      contentType: "image/png",
    },
  });

  return new Response("OK", { status: 200 });
};
