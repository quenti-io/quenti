import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    QUENTI_ENCRYPTION_KEY: z.string().length(32),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    ADMIN_EMAIL: z.string().email(),
    METRICS_API_USER: z.string(),
    METRICS_API_PASSWORD: z.string(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_SENDER: z.string().optional(),
    USE_RESEND_PREVIEWS: z
      .string()
      .optional()
      .default("true")
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true"),
    GRAFANA_DASHBOARD_URL: z.string().url().optional(),
    STRIPE_PRIVATE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_ORG_MONTHLY_PRICE_ID: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    COHERE_API_KEY: z.string().optional(),
    SERVER_NAME: z.enum(["production", "staging"]).optional(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
