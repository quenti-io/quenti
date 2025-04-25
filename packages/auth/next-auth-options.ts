import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ZitadelProvider from "next-auth/providers/zitadel";

import { env } from "@quenti/env/server";
import { APP_URL } from "@quenti/lib/constants/url";
import { prisma } from "@quenti/prisma";

import pjson from "../../apps/next/package.json";
import { sendVerificationRequest } from "./magic-link";
import { CustomPrismaAdapter } from "./prisma-adapter";

const version = pjson.version;

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {    
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username || "";
        session.user.displayName = user.displayName;
        session.user.type = user.type;
        session.user.banned = !!user.bannedAt;
        session.user.flags = user.flags;
        session.user.completedOnboarding = user.completedOnboarding;
        session.user.organizationId = user.organizationId;
        session.user.isOrgEligible = user.isOrgEligible;

        session.version = version;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same domain
      else if (new URL(url).hostname === new URL(APP_URL).hostname) return url;
      return baseUrl;
    },
    async signIn({ user }) {
      if (env.ENABLE_EMAIL_WHITELIST === "true") {
        if (
          !(await prisma.whitelistedEmail.findUnique({
            where: {
              email: user.email!,
            },
          }))
        )
          return "/unauthorized";
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    newUser: "/onboarding",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  // Configure one or more authentication providers
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // @ts-expect-error Type '"email"' is not assignable
    {
      id: "magic",
      type: "email",
      sendVerificationRequest,
    },
    ZitadelProvider({
      issuer: env.ZITADEL_ISSUER, 
      clientId: env.ZITADEL_CLIENT_ID,
      clientSecret: env.ZITADEL_CLIENT_SECRET,
      wellKnown:     `${env.ZITADEL_ISSUER}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: `openid email profile`,
        },
      },
      profile(profile) {
        console.log("📥 ZITADEL raw profile:", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.preferred_username,
          type: "ZITADEL",
        };
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};
