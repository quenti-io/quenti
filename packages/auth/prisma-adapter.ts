import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { USERNAME_REPLACE_REGEXP } from "@quenti/lib/constants/characters";
import type { PrismaClient, UserType } from "@quenti/prisma/client";
import type { Adapter } from "next-auth/adapters";

import pjson from "../../apps/next/package.json";
const version = pjson.version;

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(p),
    createUser: async (data) => {
      const name = data.name!;
      const sanitized = name.replace(USERNAME_REPLACE_REGEXP, "");

      const existing = (
        await p.user.findMany({
          where: {
            username: {
              startsWith: sanitized,
            },
          },
        })
      ).map((user) => user.username.toLowerCase());

      let uniqueUsername = sanitized;
      if (existing.length) {
        let suffix = "1";
        while (existing.some((u) => u === (sanitized + suffix).toLowerCase())) {
          suffix = (Number(suffix) + 1).toString();
        }
        uniqueUsername = sanitized + suffix;
      }

      const [base, domain] = data.email.split("@");
      const all = await import("email-providers/all.json");
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
      if (associatedDomain?.type == "Base" && associatedDomain.filter) {
        try {
          const regex = new RegExp(associatedDomain.filter);
          if (regex.test(base!)) {
            userType = "Teacher";
          }
        } catch {}
      }

      const user = await p.user.create({
        data: {
          ...data,
          username: uniqueUsername,
          changelogVersion: version,
          organizationId: associatedDomain?.orgId,
          isOrgEligible,
          type: userType,
        },
      });

      if (isOrgEligible) {
        // Get the pending invite for this email
        const invite = await p.pendingOrganizationInvite.findUnique({
          where: {
            email: data.email,
          },
        });

        if (invite) {
          await p.organizationMembership.create({
            data: {
              orgId: invite.orgId,
              role: invite.role,
              userId: user.id,
              accepted: false,
            },
          });

          await p.pendingOrganizationInvite.delete({
            where: {
              email: data.email,
            },
          });
        }
      }

      return user;
    },
  };
}
