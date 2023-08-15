import type { DefaultSession } from "next-auth";

import type { UserType } from "@quenti/prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      name: string | null;
      username: string;
      type: UserType;
      displayName: boolean;
      admin: boolean;
      banned: boolean;
      flags: number;
      enableUsageData: boolean;
      changelogVersion: string;
      organizationId: string | null;
      isOrgEligible: boolean;
    } & DefaultSession["user"];
    version: string;
  }

  interface User {
    id: string;
    name: string | null;
    username: string;
    type: UserType;
    image: string | null;
    displayName: boolean;
    bannedAt: Date | null;
    flags: number;
    enableUsageData: boolean;
    changelogVersion: string;
    organizationId: string | null;
    isOrgEligible: boolean;
  }
}
