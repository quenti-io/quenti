import type { EnabledFeature } from "@prisma/client";
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
      displayName: boolean;
      admin: boolean;
      banned: boolean;
      features: EnabledFeature[];
      enableUsageData: boolean;
      changelogVersion: string;
    } & DefaultSession["user"];
    version: string;
  }

  interface User {
    id: string;
    name?: string;
    username: string;
    image: string;
    displayName: boolean;
    bannedAt?: Date;
    features: EnabledFeature[];
    enableUsageData: boolean;
    changelogVersion: string;
  }
}
