import { type StudySet, StudySetVisibility } from "@prisma/client";
import React from "react";
import { visibilityIcon } from "../common/visibility-icon";
import { GenericCard } from "./generic-card";

export interface StudySetCardProps {
  studySet: Pick<StudySet, "id" | "title" | "visibility">;
  numTerms: number;
  user: {
    username: string;
    image: string | null;
  };
  verified?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const StudySetCard: React.FC<StudySetCardProps> = ({
  studySet,
  numTerms,
  user,
  verified = false,
  removable = false,
  onRemove,
}) => {
  return (
    <GenericCard
      title={studySet.title}
      numItems={numTerms}
      url={`/${studySet.id}`}
      itemsLabel={"term"}
      rightIcon={
        studySet.visibility !== StudySetVisibility.Public
          ? visibilityIcon(studySet.visibility, 16)
          : undefined
      }
      user={user}
      verified={verified}
      removable={removable}
      onRemove={onRemove}
    />
  );
};
