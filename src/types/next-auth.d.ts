import type { UserType } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      name?: string;
      username: string;
      type: UserType;
      displayName: boolean;
      admin: boolean;
      banned: boolean;
      flags: number;
      enableUsageData: boolean;
      changelogVersion: string;
      organizationId?: string;
    } & DefaultSession["user"];
    version: string;
  }

  interface User {
    id: string;
    name?: string;
    username: string;
    type: UserType;
    image: string;
    displayName: boolean;
    bannedAt?: Date;
    flags: number;
    enableUsageData: boolean;
    changelogVersion: string;
    organizationId?: string;
  }
}
