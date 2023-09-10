import { handler } from "./avatar";

export interface Env {
  QUENTI_ENCRYPTION_KEY: string;
  CORS_ALLOWED_ORIGINS: string;
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  USERS_BUCKET: R2Bucket;
  ASSETS_BUCKET: R2Bucket;
}

const corsHeaders = (origins = "*") => ({
  "Access-Control-Allow-Origin": origins,
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
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

    const response = await handler(request, env);
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
    return response;
  },
};
