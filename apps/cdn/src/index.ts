import { handler as assetsHandler } from "./assets";
import { handler as avatarHandler } from "./avatar";

export interface Env {
  QUENTI_ENCRYPTION_KEY: string;
  CORS_ALLOWED_ORIGINS: string;
  TWIC_DOMAIN?: string;
  CDN_ROOT_DOMAIN: string;
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  USERS_BUCKET: R2Bucket;
  ASSETS_BUCKET: R2Bucket;
}

const corsHeaders = (origins = "*") => ({
  "Access-Control-Allow-Origin": origins,
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "*",
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

    if (request.method !== "PUT")
      return new Response("Method not allowed", { status: 405 });

    const url = new URL(request.url);
    const pathname = url.pathname;

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
