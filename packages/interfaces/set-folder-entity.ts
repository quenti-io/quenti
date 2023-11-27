import type { StudySetVisibility } from "@quenti/prisma/client";

export interface SetFolderEntity {
  type: "set" | "folder";
  draft?: boolean;
  id: string;
  title: string;
  createdAt: Date;
  numItems: number;
  slug: string | null;
  visibility?: StudySetVisibility;
  user: {
    username: string;
    image: string | null;
  };
  viewedAt?: Date;
  verified?: boolean;
}
