// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_DATABASE_URL: z.string().url(),
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
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  ADMIN_EMAIL: z.string().email(),
  SCRAPER_API_KEY: z.string(),
  METRICS_API_USER: z.string(),
  METRICS_API_PASSWORD: z.string(),
  GRAFANA_DASHBOARD_URL: z.string().url().optional(),
  SERVER_NAME: z.enum(["production", "staging"]).optional(),
});

const deployment = z.enum(["production", "staging"]).optional();

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_DEPLOYMENT: deployment,
  NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_BETTERUPTIME_ID: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_DEPLOYMENT: deployment.parse(process.env.NEXT_PUBLIC_DEPLOYMENT),
  NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID:
    process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
  NEXT_PUBLIC_BETTERUPTIME_ID: process.env.NEXT_PUBLIC_BETTERUPTIME_ID,
};
