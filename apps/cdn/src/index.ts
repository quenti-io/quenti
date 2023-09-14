import { handler as assetsHandler } from "./assets";
import { handler as avatarHandler } from "./avatar";
import { resizeToDimension } from "./resize";

export interface Env {
  QUENTI_ENCRYPTION_KEY: string;
  CORS_ALLOWED_ORIGINS: string;
  CLOUDINARY_CLOUD?: string;
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  USERS_BUCKET: R2Bucket;
  ASSETS_BUCKET: R2Bucket;
}

const corsHeaders = (origins = "*") => ({
  "Access-Control-Allow-Origin": origins,
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization",
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(env.CORS_ALLOWED_ORIGINS);

    if (request.method == "OPTIONS") {
      return new Response(null, {
        headers,
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/image") && request.method === "GET") {
      let assetUrl: string, width: number, height: number;
      try {
        const parsedUrl = new URL(pathname.replace("/image/", ""));
        parsedUrl.search = "";
        parsedUrl.hash = "";
        assetUrl = parsedUrl.toString();

        width = parseInt(url.searchParams.get("w") || "");
        height = parseInt(url.searchParams.get("h") || "");
      } catch {
        return new Response("Malformed URL", { status: 400 });
      }

      const imageRequest = env.CLOUDINARY_CLOUD
        ? new Request(
            resizeToDimension(assetUrl, env, { width, height }),
            request,
          )
        : new Request(assetUrl, request);

      const result = await fetch(imageRequest);
      result.headers.set(
        "Cache-Control",
        "s-maxage=300 stale-while-revalidate=59",
      );
    }

    if (request.method !== "PUT")
      return new Response("Method not allowed", { status: 405 });

    const handler = pathname.startsWith("/avatar")
      ? avatarHandler
      : assetsHandler;

    const response = await handler(request, env);

    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
    return response;
  },
};
