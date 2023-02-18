import type { Folder } from "@prisma/client";
import { IconFolder } from "@tabler/icons-react";
import React from "react";
import { GenericCard } from "./generic-card";

export interface FolderCardProps {
  folder: Pick<Folder, "id" | "title" | "slug">;
  numSets: number;
  user: {
    username: string;
    image: string | null;
  };
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  numSets,
  user,
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
    />
  );
};
