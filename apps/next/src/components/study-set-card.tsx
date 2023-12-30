import React from "react";

import type { StudySet } from "@quenti/prisma/client";

import { Avatar, AvatarGroup, Box, HStack, Text } from "@chakra-ui/react";

import { IconGhost3, IconPointFilled, IconProgress } from "@tabler/icons-react";

import { visibilityIcon } from "../common/visibility-icon";
import { plural } from "../utils/string";
import { GenericCard } from "./generic-card";

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
        studySet.type == "Collaborative" ? (
          collaborators?.total || 0 > 0 ? (
            <AvatarGroup size="xs" max={3}>
              {collaborators?.avatars.map((avatar) => (
                <Avatar key={avatar} name={avatar} src={avatar} />
              ))}
            </AvatarGroup>
          ) : (
            <HStack
              color="gray.600"
              _dark={{
                color: "gray.400",
              }}
              fontWeight={500}
              spacing="4"
              ml="-3px"
            >
              <Box position="relative">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  opacity={0.5}
                  ml="10px"
                  zIndex={1}
                >
                  <IconGhost3 size={20} />
                </Box>
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  zIndex={2}
                  color="white"
                  _dark={{
                    color: "gray.800",
                  }}
                >
                  <IconGhost3 size={20} strokeWidth={8} />
                </Box>
                <Box
                  position="relative"
                  zIndex={3}
                  fill="white"
                  _dark={{
                    fill: "gray.900",
                  }}
                >
                  <IconGhost3 size={20} fill="inherit" />
                </Box>
              </Box>
              <Text fontSize="sm">No collaborators yet</Text>
            </HStack>
          )
        ) : undefined
      }
      verified={verified}
      removable={removable}
      onRemove={onRemove}
    />
  );
};
