import { EditorContent, type JSONContent } from "@tiptap/react";
import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";
import { env } from "@quenti/env/client";
import { outfit } from "@quenti/lib/chakra-theme";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Flex,
  GridItem,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleOff,
  IconCopy,
  IconDotsVertical,
  IconEditCircle,
  IconLink,
  IconPlus,
  IconPointFilled,
  IconProgress,
  IconTrashX,
  IconUsers,
} from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { ConfirmModal } from "../../../components/confirm-modal";
import { GenericCard } from "../../../components/generic-card";
import { MenuOption } from "../../../components/menu-option";
import { StudySetCard } from "../../../components/study-set-card";
import { Toast } from "../../../components/toast";
import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { AssignmentRightSide } from "../assignments/assignment-right-side";
import { CollabIcon } from "../assignments/collab-icon";
import { DuplicateAssignmentModal } from "../assignments/duplicate-assignment-modal";
import { extensions } from "../assignments/editor/description-editor";
import { useReadonlyEditor } from "../assignments/editor/use-readonly-editor";

export const Assignment = () => {
  const router = useRouter();
  const { data: class_ } = useClass();
  const { data: assignment } = useAssignment({
    refetchOnMount: true,
  });
  const isTeacher = useIsClassTeacher();
  const toast = useToast();

  const utils = api.useUtils();

  const editor = useReadonlyEditor({
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
  const apiSetPublished = api.assignments.setPublished.useMutation({
    onSuccess: async () => {
      setPublishOpen(false);
      await utils.assignments.get.invalidate();
    },
  });

  const copyAssignmentLink = async () => {
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/a/${class_?.id}/${assignment?.id}`;
    await navigator.clipboard.writeText(url);

    toast({
      title: "Copied to clipboard",
      status: "success",
      colorScheme: "green",
      icon: <AnimatedCheckCircle />,
      render: Toast,
    });
  };

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const [duplicateOpen, setDuplicateOpen] = React.useState(false);

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
      {isTeacher && (
        <DuplicateAssignmentModal
          isOpen={duplicateOpen}
          onClose={() => setDuplicateOpen(false)}
        />
      )}
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
      <ConfirmModal
        heading={
          assignment?.published ? "Unpublish assignment" : "Publish assignment"
        }
        body={
          assignment?.published
            ? "Are you sure you want to unpublish this assignment? Students will no longer be able to see it."
            : "Publishing this assignment will make it visible to students."
        }
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        onConfirm={() =>
          apiSetPublished.mutate({
            classId: class_!.id,
            id: assignment!.id,
            published: !assignment?.published,
          })
        }
        actionText={assignment?.published ? "Unpublish" : "Publish"}
        destructive={assignment?.published}
        isLoading={apiSetPublished.isLoading}
      />
      <Flex
        gap="8"
        flexDir={{
          base: "column",
          lg: "row",
        }}
      >
        <Stack spacing="8" flex="1" w="full" minW="0">
          <Stack spacing={!assignment || assignment.description ? 6 : 0}>
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
                <HStack
                  h="max"
                  mt="10px"
                  visibility={assignment ? "visible" : "hidden"}
                >
                  {isTeacher && assignment && (
                    <Tooltip
                      label={assignment.published ? "Published" : "Unpublished"}
                    >
                      <Box
                        color={assignment.published ? "green.500" : "gray.500"}
                        _dark={{
                          color: assignment.published
                            ? "green.300"
                            : "gray.500",
                        }}
                      >
                        {assignment.published ? (
                          <IconCircleCheckFilled />
                        ) : (
                          <IconProgress />
                        )}
                      </Box>
                    </Tooltip>
                  )}
                  <Menu placement="bottom-end">
                    <MenuButton h="max">
                      <IconDotsVertical size={24} />
                    </MenuButton>
                    <MenuList
                      mt="2"
                      bg="white"
                      _dark={{
                        bg: "gray.800",
                      }}
                      py={0}
                      overflow="hidden"
                      minW="auto"
                      w="32"
                    >
                      {isTeacher && (
                        <>
                          <MenuOption
                            icon={
                              assignment?.published ? (
                                <IconCircleOff size={16} />
                              ) : (
                                <IconCircleCheck size={16} />
                              )
                            }
                            label={
                              assignment?.published ? "Unpublish" : "Publish"
                            }
                            fontSize="sm"
                            py="6px"
                            onClick={() => setPublishOpen(true)}
                          />
                          <MenuOption
                            icon={<IconEditCircle size={16} />}
                            label="Edit"
                            as={Link}
                            href={`/a/${class_?.id || ""}/${
                              assignment?.id || ""
                            }/edit`}
                            fontSize="sm"
                            py="6px"
                          />
                          <MenuOption
                            icon={<IconCopy size={16} />}
                            label="Duplicate"
                            fontSize="sm"
                            py="6px"
                            onClick={() => setDuplicateOpen(true)}
                          />
                        </>
                      )}
                      <MenuOption
                        icon={<IconLink size={16} />}
                        label="Copy link"
                        fontSize="sm"
                        py="6px"
                        onClick={() => void copyAssignmentLink()}
                      />
                      {isTeacher && (
                        <>
                          <MenuDivider />
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
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>
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
                assignment.description && <EditorContent editor={editor} />
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
            <GridItem>
              {assignment?.studySet ? (
                <StudySetCard
                  studySet={assignment.studySet}
                  collaborators={assignment.studySet.collaborators}
                  numTerms={assignment.studySet._count.terms}
                  user={{
                    username: null,
                    image: null,
                  }}
                />
              ) : assignment && isTeacher ? (
                <Button
                  w="full"
                  h="150px"
                  variant="outline"
                  leftIcon={<IconPlus />}
                  onClick={async () => {
                    await router.push(
                      `/a/${class_!.id}/${assignment.id}/study-set`,
                    );
                  }}
                >
                  Attach a study set
                </Button>
              ) : undefined}
              {!assignment && <GenericCard.Skeleton />}
            </GridItem>
          </SimpleGrid>
        </Stack>
        <Stack minW="215px" w="215px" flex="0">
          <AssignmentRightSide />
        </Stack>
      </Flex>
    </>
  );
};
