import type { NextApiHandler } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { withHighlight } from "../../../../highlight.config";
import { CustomPrismaAdapter } from "../../../adapters/prisma-username";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

import pjson from "../../../../package.json";
const version = pjson.version;

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.displayName = user.displayName;
        session.user.admin = user.email == env.ADMIN_EMAIL;
        session.user.type = user.type;
        session.user.banned = !!user.bannedAt;
        session.user.flags = user.flags;
        session.user.enableUsageData = user.enableUsageData;
        session.user.changelogVersion = user.changelogVersion;
        session.user.organizationId = user.organizationId;

        session.version = version;
      }
      return session;
    },
    async signIn({ user }) {
      const regexes = await prisma.allowedEmailRegex.findMany();

      const matchedRegex = regexes.some((r) => {
        try {
          const regex = new RegExp(r.regex, "g");
          return regex.test(user.email || "");
        } catch {
          return false;
        }
      });

      const emailAllowed =
        matchedRegex ||
        !!(await prisma.whitelistedEmail.findUnique({
          where: {
            email: user.email || "",
          },
        }));

      const bypass =
        user.email == env.ADMIN_EMAIL ||
        (user.username && user.username.toLowerCase() == "quizlet");

      if (!emailAllowed && !bypass) {
        const tenRecent = await prisma.recentFailedLogin.findMany({
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        });
        await prisma.recentFailedLogin.deleteMany({
          where: {
            NOT: {
              id: {
                in: tenRecent.map((r) => r.id),
              },
            },
          },
        });

        if (!tenRecent.find((r) => r.email == user.email)) {
          await prisma.recentFailedLogin.create({
            data: {
              email: user.email || "",
              name: user.name,
              image: user.image,
            },
          });
        }

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

export default withHighlight(NextAuth(authOptions) as NextApiHandler);
