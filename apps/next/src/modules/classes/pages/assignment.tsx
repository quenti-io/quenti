import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import { useRouter } from "next/router";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";
import { outfit } from "@quenti/lib/chakra-theme";
import { api } from "@quenti/trpc";

import {
  Box,
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconDotsVertical,
  IconEditCircle,
  IconLink,
  IconPointFilled,
  IconTrashX,
  IconUsers,
} from "@tabler/icons-react";

import { ConfirmModal } from "../../../components/confirm-modal";
import { GenericCard } from "../../../components/generic-card";
import { MenuOption } from "../../../components/menu-option";
import { StudySetCard } from "../../../components/study-set-card";
import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { AssignmentRighSide } from "../assignments/assignment-right-side";
import { CollabIcon } from "../assignments/collab-icon";
import { extensions } from "../assignments/new/description-editor";

export const Assignment = () => {
  const router = useRouter();
  const { data: class_ } = useClass();
  const { data: assignment } = useAssignment();
  const isTeacher = useIsClassTeacher();

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

  const apiDelete = api.assignments.delete.useMutation({
    onSuccess: async () => {
      await router.push(`/classes/${class_!.id}/assignments`);
    },
  });

  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
      {
        <ConfirmModal
          heading="Delete assignment"
          body="Are you sure you want to delete this assignment? This action cannot be undone."
          destructive
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() =>
            apiDelete.mutate({
              classId: class_!.id,
              id: assignment!.id,
            })
          }
          actionText="Delete"
          isLoading={apiDelete.isLoading}
        />
      }
      <Flex
        gap="8"
        flexDir={{
          base: "column",
          lg: "row",
        }}
      >
        <Stack spacing="8" flex="1" w="full" minW="0">
          <Stack spacing="6">
            <Stack spacing="3">
              <Flex gap="6" justifyContent="space-between">
                <SkeletonText
                  noOfLines={1}
                  fitContent
                  w="max"
                  maxW="full"
                  skeletonHeight="36px"
                  minHeight={43.2}
                  isLoaded={!!assignment}
                >
                  <Heading>
                    {assignment?.title || "Placeholder Assignment Title"}
                  </Heading>
                </SkeletonText>
                <Menu placement="bottom-end">
                  <MenuButton
                    h="max"
                    mt="10px"
                    visibility={assignment ? "visible" : "hidden"}
                  >
                    <IconDotsVertical size={24} />
                  </MenuButton>
                  <MenuList
                    bg="white"
                    _dark={{
                      bg: "gray.800",
                    }}
                    py={0}
                    overflow="hidden"
                    minW="auto"
                    w="32"
                  >
                    <MenuOption
                      icon={<IconLink size={16} />}
                      label="Copy link"
                      fontSize="sm"
                      py="6px"
                      onClick={() => {}}
                    />
                    <MenuOption
                      icon={<IconEditCircle size={16} />}
                      label="Edit"
                      fontSize="sm"
                      py="6px"
                      onClick={() => {}}
                    />
                    <MenuOption
                      icon={<IconTrashX size={16} />}
                      label="Delete"
                      fontSize="sm"
                      py="6px"
                      color="red.600"
                      _dark={{
                        color: "red.200",
                      }}
                      onClick={() => setDeleteOpen(true)}
                    />
                  </MenuList>
                </Menu>
              </Flex>
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
                {!!assignment && isTeacher && (
                  <>
                    <IconPointFilled size={10} />
                    <HStack
                      color="gray.700"
                      _dark={{
                        color: "gray.300",
                      }}
                      spacing="6px"
                    >
                      <IconUsers size={14} />
                      <Text fontSize="sm">{assignment?.section.name}</Text>
                    </HStack>
                  </>
                )}
              </HStack>
            </Stack>
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
          <SimpleGrid columns={{ base: 1, sm: 2 }}>
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
        <Stack minW="215px" w="215px" flex="0">
          <AssignmentRighSide />
        </Stack>
      </Flex>
    </>
  );
};
