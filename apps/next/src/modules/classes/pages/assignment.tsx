import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import React from "react";

import { outfit } from "@quenti/lib/chakra-theme";

import {
  Box,
  HStack,
  Heading,
  SimpleGrid,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { GenericCard } from "../../../components/generic-card";
import { StudySetCard } from "../../../components/study-set-card";
import { useAssignment } from "../../../hooks/use-assignment";
import { CollabIcon } from "../assignments/collab-icon";
import { extensions } from "../assignments/new/description-editor";

export const Assignment = () => {
  const { data: assignment } = useAssignment();

  const editor = useEditor({
    editable: false,
    content: (assignment?.description as JSONContent) ?? "<p></p>",
    extensions: extensions,
  });

  React.useEffect(() => {
    if (!assignment?.description) return;
    editor?.commands.setContent(assignment?.description as JSONContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment?.description]);

  return (
    <Stack spacing="6">
      <Stack spacing="6">
        <SkeletonText
          noOfLines={1}
          fitContent
          skeletonHeight="36px"
          isLoaded={!!assignment}
        >
          <Stack>
            <Heading>
              {assignment?.title || "Placeholder Assignment Title"}
            </Heading>
            <HStack>
              <HStack>
                <Box w="max">
                  <CollabIcon size={24} />
                </Box>
                <Text
                  fontWeight={700}
                  bgClip="text"
                  fontFamily={outfit.style.fontFamily}
                  bgGradient="linear(to-r, blue.600, blue.500)"
                  _dark={{
                    bgGradient: "linear(to-r, blue.300, blue.200)",
                  }}
                >
                  Collab
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </SkeletonText>
        <Box
          color="gray.800"
          _dark={{
            color: "gray.200",
          }}
        >
          {assignment ? (
            <EditorContent editor={editor} />
          ) : (
            <SkeletonText
              noOfLines={3}
              skeletonHeight={4}
              spacing="3"
              isLoaded={!!assignment}
            />
          )}
        </Box>
      </Stack>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }}>
        {assignment?.studySet && (
          <StudySetCard
            studySet={assignment.studySet}
            numTerms={0}
            user={{
              username: null,
              image: null,
            }}
          />
        )}
        {!assignment && <GenericCard.Skeleton />}
      </SimpleGrid>
    </Stack>
  );
};
