import React from "react";

import type { Folder } from "@quenti/prisma/client";

import { IconFolder } from "@tabler/icons-react";

import { GenericCard } from "./generic-card";

export interface FolderCardProps {
  folder: Pick<Folder, "id" | "title" | "slug">;
  numSets: number;
  user: {
    username: string | null;
    image: string | null;
  };
  removable?: boolean;
  onRemove?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  numSets,
  user,
  removable = false,
  onRemove,
}) => {
  return (
    <GenericCard
      title={folder.title}
      numItems={numSets}
      url={`/@${user.username}/folders/${folder.slug ?? folder.id}`}
      itemsLabel={"set"}
      user={user}
      leftIcon={<IconFolder size={16} />}
      reverseTitle
      removable={removable}
      onRemove={onRemove}
    />
  );
};
