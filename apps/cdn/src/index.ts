import jose from "jose";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  USERS_BUCKET: R2Bucket;
  ASSETS_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "PUT")
      return new Response("Method not allowed", { status: 405 });

    const auth = request.headers.get("Authorization");
    const jwt = auth?.split("Bearer ")[1];
    if (!jwt) return new Response("Unauthorized", { status: 401 });

    const { payload } = jose.jwtVerify(jwt, env.QUENTI_ENCRYPTION_KEY);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return new Response("Hello World!");
  },
};
