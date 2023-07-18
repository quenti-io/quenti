import { env as clientEnv } from "../env/client.mjs";
import { env as serverEnv } from "../env/server.mjs";

export const IS_PAYMENT_ENABLED = !!(
  serverEnv.STRIPE_PRIVATE_KEY && clientEnv.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);
