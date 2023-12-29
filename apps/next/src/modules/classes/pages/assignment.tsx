import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";
import { outfit } from "@quenti/lib/chakra-theme";

import {
  Box,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconPointFilled } from "@tabler/icons-react";

import { GenericCard } from "../../../components/generic-card";
import { StudySetCard } from "../../../components/study-set-card";
import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { CollabIcon } from "../assignments/collab-icon";
import { extensions } from "../assignments/new/description-editor";

export const Assignment = () => {
  const { data: class_ } = useClass();
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
    <>
      {assignment && class_ && (
        <HeadSeo
          title={`${assignment.title} - ${class_.name}`}
          nextSeoProps={{
            noindex: true,
            nofollow: true,
          }}
        />
      )}
      <Stack spacing="6">
        <Stack spacing="6">
          <Stack spacing="3">
            <SkeletonText
              noOfLines={1}
              fitContent
              w="max"
              maxW="full"
              skeletonHeight="36px"
              minHeight={43.2}
              isLoaded={!!assignment}
            >
              <Stack>
                <Heading>
                  {assignment?.title || "Placeholder Assignment Title"}
                </Heading>
              </Stack>
            </SkeletonText>
            <HStack color="gray.500">
              <HStack>
                <Skeleton rounded="full" isLoaded={!!assignment}>
                  <Box w="max">
                    <CollabIcon size={24} />
                  </Box>
                </Skeleton>
                <SkeletonText
                  fitContent
                  noOfLines={1}
                  isLoaded={!!assignment}
                  height={6}
                  skeletonHeight="16px"
                  display="flex"
                  alignItems="center"
                >
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
                </SkeletonText>
              </HStack>
              <Skeleton rounded="full" isLoaded={!!assignment}>
                <IconPointFilled size={10} />
              </Skeleton>
              <SkeletonText
                fitContent
                noOfLines={1}
                isLoaded={!!assignment}
                height="21px"
                skeletonHeight="14px"
                display="flex"
                alignItems="center"
              >
                <Text
                  fontSize="sm"
                  color="gray.700"
                  _dark={{
                    color: "gray.300",
                  }}
                >
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(assignment?.availableAt ?? 0))}
                </Text>
              </SkeletonText>
            </HStack>
          </Stack>
          <Box
            w="full"
            h="2px"
            rounded="full"
            bg="gray.200"
            _dark={{
              bg: "gray.700",
            }}
          />
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
    </>
  );
};
