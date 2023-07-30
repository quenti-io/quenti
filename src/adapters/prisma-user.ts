import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { USERNAME_REPLACE_REGEXP } from "../constants/characters";

import pjson from "../../package.json";
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

      const domain = data.email.split("@")[1]!;

      const associatedOrg = await p.verifiedOrganizationDomain.findFirst({
        where: {
          domain,
          AND: {
            // Just to be super cautious, even though this condition is implied
            organization: {
              published: true,
            },
          },
        },
      });

      /**
       * All users by default need to be students and connected to an organization if their email matches a verified domain.
       * We don't want to disallow org invites for anyone with a verified 'student' email in case a teacher is accidentally added as a student.
       * It's possible that a teacher might be accidentally added as a student, and unable to join the org(s) they were invited to,
       * so why not make them a teacher by default or if they have pending org invites?
       *
       * Here's a possible exploit for students:
       * 1. Student signs up with a personal account and changes their account type to 'Teacher'
       * 2. Student creates an organization and invites their school email to join
       * 3. When the account with the school email is created, it will be created as a teacher and not bound to the org
       */
      const user = await p.user.create({
        data: {
          ...data,
          username: uniqueUsername,
          changelogVersion: version,
          organizationId: associatedOrg?.orgId,
          type: "Student",
        },
      });

      // Get pending invites to organizations
      const pendingInvites = await p.pendingInvite.findMany({
        where: {
          email: data.email,
        },
      });

      await p.membership.createMany({
        data: pendingInvites.map((invite) => ({
          orgId: invite.orgId,
          role: invite.role,
          userId: user.id,
          accepted: false,
        })),
      });

      await p.pendingInvite.deleteMany({
        where: {
          email: data.email,
        },
      });

      return user;
    },
  };
}
