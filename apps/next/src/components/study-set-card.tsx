import React from "react";

import type { StudySet } from "@quenti/prisma/client";

import { HStack, Text } from "@chakra-ui/react";

import { IconPointFilled, IconProgress } from "@tabler/icons-react";

import { visibilityIcon } from "../common/visibility-icon";
import { plural } from "../utils/string";
import { GenericCard } from "./generic-card";
import { GenericCollaboratorsFooter } from "./generic-collaborators-footer";

export interface StudySetCardProps {
  studySet: Pick<StudySet, "id" | "title" | "visibility" | "type">;
  numTerms: number;
  collaborators?: { total: number; avatars: string[] };
  draft?: boolean;
  user: {
    username: string | null;
    image: string | null;
  };
  verified?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const StudySetCard: React.FC<StudySetCardProps> = ({
  studySet,
  numTerms,
  collaborators,
  draft,
  user,
  verified = false,
  removable = false,
  onRemove,
}) => {
  return (
    <GenericCard
      title={studySet.title || "Untitled"}
      numItems={numTerms}
      url={!draft ? `/${studySet.id}` : `/${studySet.id}/create`}
      itemsLabel={"term"}
      label={
        draft ? (
          <>
            <IconProgress size={16} />
            <HStack spacing="1" fontSize="sm">
              <Text>Draft</Text>
              <IconPointFilled size={8} />
              <Text>{plural(numTerms, "term")}</Text>
            </HStack>
          </>
        ) : undefined
      }
      reverseTitle={draft}
      rightIcon={
        studySet.visibility !== "Public"
          ? visibilityIcon(studySet.visibility, 16)
          : undefined
      }
      user={user}
      bottom={
        studySet.type == "Collab" ? (
          <GenericCollaboratorsFooter
            avatars={collaborators?.avatars || []}
            total={collaborators?.total || 0}
          />
        ) : undefined
      }
      verified={verified}
      removable={removable}
      onRemove={onRemove}
    />
  );
};
