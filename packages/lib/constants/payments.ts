import { env as clientEnv } from "@quenti/env/client";
import { env as serverEnv } from "@quenti/env/server";

export const IS_PAYMENT_ENABLED = !!(
  serverEnv.STRIPE_PRIVATE_KEY && clientEnv.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);
