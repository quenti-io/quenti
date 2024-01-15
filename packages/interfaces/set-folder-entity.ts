import type { StudySetType, StudySetVisibility } from "@quenti/prisma/client";

export interface SetFolderEntity {
  entityType: "set" | "folder";
  draft?: boolean;
  id: string;
  title: string;
  type?: StudySetType;
  createdAt: Date;
  numItems: number;
  slug: string | null;
  visibility?: StudySetVisibility;
  collaborators?: {
    total: number;
    avatars: string[];
  };
  user: {
    username: string;
    image: string | null;
  };
  viewedAt?: Date;
  verified?: boolean;
}
