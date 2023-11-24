import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const deployment = z.enum(["production", "staging"]).optional();

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_DEPLOYMENT: deployment,
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_BETTERUPTIME_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_CDN_WORKER_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_CGI_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_TELEMETRY_HOST: z.string().optional(),
    NEXT_PUBLIC_TELEMETRY_KEY: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_DEPLOYMENT: deployment.parse(
      process.env.NEXT_PUBLIC_DEPLOYMENT,
    ),
    NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID:
      process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    NEXT_PUBLIC_BETTERUPTIME_ID: process.env.NEXT_PUBLIC_BETTERUPTIME_ID,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_CDN_WORKER_ENDPOINT:
      process.env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT,
    NEXT_PUBLIC_CGI_ENDPOINT: process.env.NEXT_PUBLIC_CGI_ENDPOINT,
    NEXT_PUBLIC_TELEMETRY_HOST: process.env.NEXT_PUBLIC_TELEMETRY_HOST,
    NEXT_PUBLIC_TELEMETRY_KEY: process.env.NEXT_PUBLIC_TELEMETRY_KEY,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
