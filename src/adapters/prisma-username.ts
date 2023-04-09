import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { USERNAME_REPLACE_REGEXP } from "../constants/characters";

import pjson from "../../package.json";
const version = pjson.version;

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(p),
    // @ts-expect-error Type '(data: Omit<AdapterUser, "id">) => Promise<User>' is not assignable to type
    createUser: async (data) => {
      const name = data.name!;
      const sanitized = name.replace(USERNAME_REPLACE_REGEXP, "");

      const existing = (
        await p.user.findMany({
          where: {
            username: {
              mode: "insensitive",
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

      return await p.user.create({
        data: {
          ...data,
          username: uniqueUsername,
          changelogVersion: version,
        },
      });
    },
  };
}
