import { EditorContent, type JSONContent } from "@tiptap/react";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Flex,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { IconCalendar, IconPlus, IconUsers } from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { GenericCard } from "../../../components/generic-card";
import { StudySetCard } from "../../../components/study-set-card";
import { Toast } from "../../../components/toast";
import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { formatDueDate } from "../../../utils/time";
import { extensions } from "../assignments/editor/description-editor";
import { useReadonlyEditor } from "../assignments/editor/use-readonly-editor";
import { ClassWizardLayout } from "../class-wizard-layout";
import { useProtectedRedirect } from "../use-protected-redirect";

export const AssignmentPublish = () => {
  const router = useRouter();
  const { data: class_ } = useClass();
  const { data: assignment } = useAssignment();
  const isLoaded = useProtectedRedirect();
  const isTeacher = useIsClassTeacher();
  const utils = api.useUtils();
  const toast = useToast();

  const editor = useReadonlyEditor({
    editable: false,
    content: (assignment?.description as JSONContent) || "<p></p>",
    extensions: extensions,
  });

  React.useEffect(() => {
    if (!assignment?.description) return;
    editor?.commands.setContent(assignment?.description as JSONContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment?.description]);

  const apiSetPublished = api.assignments.setPublished.useMutation({
    onSuccess: async () => {
      await utils.assignments.get.invalidate();
      await router.push(`/a/${class_!.id}/${assignment!.id}`);

      toast({
        title: "Published assignment",
        status: "success",
        colorScheme: "green",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
  });

  return (
    <ClassWizardLayout
      title="Publish"
      seoTitle="Publish"
      currentStep={3}
      steps={4}
      description="You're almost done! Review your assignment and publish it to your class."
    >
      <Stack spacing="6">
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing="4">
              <Skeleton fitContent rounded="lg" isLoaded={isLoaded}>
                <Heading>
                  {assignment?.title || "Placeholder Assignment Title"}
                </Heading>
              </Skeleton>
              <HStack fontSize="sm" spacing="6px">
                <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                  <IconUsers size={16} />
                </Skeleton>
                <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                  <Text fontWeight={500}>
                    {assignment?.section.name || "Sectio name"}
                  </Text>
                </Skeleton>
              </HStack>
              <HStack
                fontSize="sm"
                color="gray.700"
                _dark={{
                  color: "gray.300",
                }}
                spacing="4"
                flexDir={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
              >
                <HStack spacing="6px">
                  <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                    <IconCalendar size={16} />
                  </Skeleton>
                  <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                    <Text gap="6px" display="flex">
                      <strong>Available</strong>{" "}
                      {formatDueDate(assignment?.availableAt ?? new Date())}
                    </Text>
                  </Skeleton>
                </HStack>
                <HStack spacing="6px">
                  <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                    <IconCalendar size={16} />
                  </Skeleton>
                  <Skeleton fitContent rounded="md" isLoaded={isLoaded}>
                    <Text gap="6px" display="flex">
                      {assignment?.dueAt ? (
                        <>
                          <strong>Due</strong>{" "}
                          {formatDueDate(assignment?.dueAt)}
                        </>
                      ) : (
                        "No due date"
                      )}
                    </Text>
                  </Skeleton>
                </HStack>
              </HStack>
            </Stack>
            {isLoaded ? (
              assignment?.description && <EditorContent editor={editor} />
            ) : (
              <SkeletonText noOfLines={3} skeletonHeight={4} spacing="3" />
            )}
          </Stack>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }}>
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
      </Stack>
      <Flex w="full" mt="6">
        <ButtonGroup>
          <Skeleton isLoaded={isLoaded} rounded="lg">
            <Button
              variant="ghost"
              onClick={async () => {
                await router.push(`/a/${class_!.id}/${assignment!.id}`);
              }}
            >
              Skip
            </Button>
          </Skeleton>
          <Skeleton isLoaded={isLoaded} rounded="lg">
            <Button
              onClick={() => {
                apiSetPublished.mutate({
                  classId: class_!.id,
                  id: assignment!.id,
                  published: true,
                });
              }}
              isLoading={apiSetPublished.isLoading}
            >
              Publish
            </Button>
          </Skeleton>
        </ButtonGroup>
      </Flex>
    </ClassWizardLayout>
  );
};
