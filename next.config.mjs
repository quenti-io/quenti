// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  rewrites: async () => [
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
  ],
};
export default config;
