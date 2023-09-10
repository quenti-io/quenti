import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const deployment = z.enum(["production", "staging"]).optional();

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_DEPLOYMENT: deployment,
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_BETTERUPTIME_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_CDN_WORKER_ENDPOINT: z.string().url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DEPLOYMENT: deployment.parse(
      process.env.NEXT_PUBLIC_DEPLOYMENT,
    ),
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID:
      process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    NEXT_PUBLIC_BETTERUPTIME_ID: process.env.NEXT_PUBLIC_BETTERUPTIME_ID,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_CDN_WORKER_ENDPOINT:
      process.env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
