import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";

import { env as clientEnv } from "@quenti/env/client";
import { env } from "@quenti/env/server";
import { USERNAME_REPLACE_REGEXP } from "@quenti/lib/constants/characters";
import type { PrismaClient, UserType } from "@quenti/prisma/client";

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(p),
    createUser: async (data) => {
      const name = data.name;

      let uniqueUsername = null;
      if (name) {
        const sanitized = name.replace(USERNAME_REPLACE_REGEXP, "");
        uniqueUsername = sanitized;

        const existing = (
          await p.user.findMany({
            where: {
              username: {
                not: null,
                startsWith: sanitized,
              },
            },
          })
        ).map((user) => user.username?.toLowerCase());

        if (existing.length) {
          let suffix = "1";
          while (
            existing.some((u) => u === (sanitized + suffix).toLowerCase())
          ) {
            suffix = (Number(suffix) + 1).toString();
          }
          uniqueUsername = sanitized + suffix;
        }
      }

      const [base, domain] = data.email.split("@");
      const all =
        env.BYPASS_ORG_DOMAIN_BLACKLIST === "true"
          ? []
          : Array.from(await import("email-providers/all.json"));
      const isOrgEligible = !all.find((d) => d == domain);

      const associatedDomain = isOrgEligible
        ? await p.organizationDomain.findFirst({
            where: {
              domain,
              AND: {
                organization: {
                  published: true,
                },
              },
            },
          })
        : undefined;

      let userType: UserType = "Student";
      if (associatedDomain?.type == "Base") {
        if (associatedDomain.filter) {
          try {
            const regex = new RegExp(associatedDomain.filter);
            if (regex.test(base!)) {
              userType = "Teacher";
            }
          } catch {}
        } else {
          userType = "Teacher";
        }
      }

      let image = data.image;
      if (!image) {
        const index = Math.floor(Math.random() * 5);
        image = `${clientEnv.NEXT_PUBLIC_APP_URL}/avatars/default/${index}.png`;
      }

      const user = await p.user.create({
        data: {
          ...data,
          username: uniqueUsername,
          organizationId: associatedDomain?.orgId,
          displayName: !!data.name,
          isOrgEligible,
          type: userType,
          image,
        },
      });

      if (isOrgEligible) {
        await p.pendingOrganizationInvite.updateMany({
          where: {
            email: data.email,
          },
          data: {
            userId: user.id,
          },
        });
      }

      return user;
    },
  };
}
