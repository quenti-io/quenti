import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomPrismaAdapter } from "../../../adapters/prisma-username";
// Prisma adapter for NextAuth, optional and can be removed

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.displayName = user.displayName;
        session.user.admin = user.email == env.ADMIN_EMAIL;
      }
      return session;
    },
    async signIn({ user }) {
      const whitelisted = await prisma.whitelistedEmail.findUnique({
        where: {
          email: user.email || "",
        },
      });

      if (!whitelisted) {
        return "/unauthorized";
      }
      return true;
    },
  },
  pages: {
    signOut: "/",
    newUser: "/onboarding",
  },
  // Configure one or more authentication providers
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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

export default NextAuth(authOptions);
