const shouldAnalyzeBundles = process.env.ANALYZE === "true";

import { withHighlightConfig } from "@highlight-run/next";
import { withAxiom } from "next-axiom";
const withBundleAnalyzer = shouldAnalyzeBundles
  ? (await import("@next/bundle-analyzer")).default
  : () => undefined;

import pjson from "./package.json" assert { type: "json" };
const appVersion = pjson.version;

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import "@quenti/env/client/client.mjs";
import "@quenti/env/server/server.mjs";

/** @type {import("next").NextConfig} */
let config = withHighlightConfig(
  withAxiom({
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
    images: {
      domains: ["lh3.googleusercontent.com"],
    },
    transpilePackages: [
      "@quenti/auth",
      "@quenti/core",
      "@quenti/emails",
      "@quenti/env",
      "@quenti/interfaces",
      "@quenti/lib",
      "@quenti/payments",
      "@quenti/prisma",
      "@quenti/trpc",
      "@quenti/types",
    ],
    rewrites: async () => [
      {
        source: "/:id(_[a-zA-Z0-9]{10})",
        destination: "/share-resolver/:id",
      },
      {
        source: "/:profile(@[a-zA-Z0-9-_]+)",
        destination: "/profile/:profile",
      },
      {
        source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug",
        destination: "/profile/:profile/folders/:slug",
      },
      {
        source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug/flashcards",
        destination: "/profile/:profile/folders/:slug/flashcards",
      },
      {
        source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug/match",
        destination: "/profile/:profile/folders/:slug/match",
      },
      {
        source: "/:id(c[a-z0-9]{24})",
        destination: "/sets/:id",
      },
      {
        source: "/:id(c[a-z0-9]{24})/edit",
        destination: "/sets/:id/edit",
      },
      {
        source: "/:id(c[a-z0-9]{24})/flashcards",
        destination: "/sets/:id/flashcards",
      },
      {
        source: "/:id(c[a-z0-9]{24})/learn",
        destination: "/sets/:id/learn",
      },
      {
        source: "/:id(c[a-z0-9]{24})/match",
        destination: "/sets/:id/match",
      },
    ],
    productionBrowserSourceMaps: true,
  }),
  {
    appVersion,
    configureHighlightProxy: true,
    uploadSourceMaps: false,
  }
);

if (shouldAnalyzeBundles) {
  config = withBundleAnalyzer(config);
}

export default config;