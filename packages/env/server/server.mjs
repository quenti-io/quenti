import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PLANETSCALE: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),
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
    ADMIN_WEBHOOK_SECRET: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    QSTASH_TOKEN: z.string().optional(),
    COHERE_API_KEY: z.string().optional(),
    HUGGINGFACE_ENDPOINT: z.string().url().optional(),
    HUGGINGFACE_API_KEY: z.string().optional(),
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    USERS_BUCKET_NAME: z.string().optional(),
    USERS_BUCKET_URL: z.string().url().optional(),
    ASSETS_BUCKET_NAME: z.string().optional(),
    ASSETS_BUCKET_URL: z.string().url().optional(),
    UNSPLASH_ACCESS_KEY: z.string().optional(),
    ENABLE_CLICKHOUSE: z.string().optional(),
    CLICKHOUSE_HOST: z.string().url().optional(),
    CLICKHOUSE_USER: z.string().optional(),
    CLICKHOUSE_PASSWORD: z.string().optional(),
    SERVER_NAME: z.enum(["production", "staging"]).optional(),
    BYPASS_ORG_DOMAIN_BLACKLIST: z.string().optional(),
    ENABLE_EMAIL_WHITELIST: z.string().optional(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
