import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { LANGUAGE_VALUES, type Language, languageName } from "@quenti/core";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  Input,
  PopoverAnchor,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconArrowRight,
  IconLanguage,
  IconUsersGroup,
} from "@tabler/icons-react";

import { visibilityIcon } from "../../../common/visibility-icon";
import { AutoResizeTextarea } from "../../../components/auto-resize-textarea";
import { SkeletonLabel } from "../../../components/skeleton-label";
import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { LanguageMenuWrapper } from "../../editor/language-menu";
import { VisibilityModal } from "../../editor/visibility-modal";
import { ClassWizardLayout } from "../class-wizard-layout";
import { useProtectedRedirect } from "../use-protected-redirect";

interface CreateSetFormInputs {
  title: string;
  description: string;
  visibility: "Private" | "Unlisted" | "Public" | "Class";
  classesWithAccess: string[];
  wordLanguage: Language;
  definitionLanguage: Language;
}

const schema = z.object({
  title: z.string().trim().min(1, { message: "Enter a title" }),
  description: z.string().default("").optional(),
  visibility: z.enum(["Private", "Unlisted", "Public", "Class"]),
  classesWithAccess: z.array(z.string().cuid()).default([]),
  wordLanguage: z.enum(LANGUAGE_VALUES),
  definitionLanguage: z.enum(LANGUAGE_VALUES),
});

export const AssignmentStudySet = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;
  const utils = api.useUtils();

  useAssignment();
  const isLoaded = useProtectedRedirect();
  const { data: class_ } = useClass();

  const [visibilityOpen, setVisibilityOpen] = React.useState(false);
  const [termLangOpen, setTermLangOpen] = React.useState(false);
  const [defLangOpen, setDefLangOpen] = React.useState(false);

  const createMethods = useForm<CreateSetFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "Class",
      classesWithAccess: [],
      wordLanguage: "en",
      definitionLanguage: "en",
    },
  });
  const {
    formState: { errors },
    watch,
  } = createMethods;

  const _title = watch("title");
  const _visibility = watch("visibility");
  const _classesWithAccess = watch("classesWithAccess");

  React.useEffect(() => {
    if (!isLoaded) return;
    createMethods.setValue("classesWithAccess", [class_!.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const createCollaborative = api.assignments.createCollaborative.useMutation({
    onSuccess: async () => {
      await utils.assignments.get.invalidate();
      await router.push(`/classes/${id}/assignments/${assignmentId}/collab`);
    },
  });

  const onSubmit: SubmitHandler<CreateSetFormInputs> = async (data) => {
    await createCollaborative.mutateAsync({
      classId: id,
      assignmentId,
      title: data.title,
      description: data.description,
      visibility: data.visibility,
      wordLanguage: data.wordLanguage,
      definitionLanguage: data.definitionLanguage,
      classesWithAccess: data.classesWithAccess,
    });
  };

  return (
    <ClassWizardLayout
      title="Create a study set"
      seoTitle="Create a study set"
      currentStep={1}
      steps={4}
      description="Create a Collab study set to attach to your assignment."
    >
      <VisibilityModal
        noPrivate
        visibility={_visibility}
        currentClass={id}
        onChangeVisibility={(v) => {
          if (v !== "Class") setVisibilityOpen(false);
          createMethods.setValue("visibility", v);
        }}
        isOpen={visibilityOpen}
        onClose={() => setVisibilityOpen(false)}
        classesWithAccess={_classesWithAccess}
        onChangeClassesWithAccess={(classes) => {
          createMethods.setValue("classesWithAccess", classes);
        }}
      />
      <form
        onSubmit={createMethods.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <HStack
          justifyContent="space-between"
          spacing={{ base: 2, md: 6, lg: 6 }}
          flexDir={{
            base: "column",
            sd: "row",
          }}
          bg="white"
          borderColor="gray.100"
          _dark={{
            bg: "gray.800",
            borderColor: "gray.750",
          }}
          borderWidth="2px"
          w={{ base: "calc(100% + 32px)", sm: "calc(100% + 64px)" }}
          ml={{ base: "-4", sm: "-8" }}
          p={{ base: 0, sd: 8 }}
          py="6"
          pr={{ base: 0, sd: 0 }}
          rounded="2xl"
          shadow="lg"
        >
          <Stack
            spacing="7"
            flex="1"
            w={{ base: "full", sd: "auto" }}
            px={{
              base: 6,
              sd: 0,
            }}
          >
            <HStack>
              <Controller
                name="title"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.title}>
                    <Stack w="full" spacing="1">
                      <SkeletonLabel isLoaded={isLoaded}>Title</SkeletonLabel>
                      <Skeleton rounded="lg" isLoaded={isLoaded}>
                        <Input
                          autoFocus
                          shadow="sm"
                          value={value}
                          onChange={onChange}
                          rounded="lg"
                          placeholder="Set Title"
                        />
                      </Skeleton>
                    </Stack>
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </HStack>
            <Stack spacing="1">
              <SkeletonLabel isLoaded={isLoaded}>
                Description (optional)
              </SkeletonLabel>
              <Skeleton rounded="lg" isLoaded={isLoaded}>
                <Controller
                  name="description"
                  control={createMethods.control}
                  render={({ field: { value, onChange } }) => (
                    <AutoResizeTextarea
                      value={value}
                      onChange={onChange}
                      shadow="sm"
                      rounded="lg"
                      py="2"
                      minHeight={36}
                      maxH={36}
                      overflowY="auto"
                      placeholder="Add a description..."
                      allowTab={false}
                      w="full"
                    />
                  )}
                />
              </Skeleton>
            </Stack>
            <HStack spacing="4">
              <Stack w="full" spacing="1">
                <SkeletonLabel isLoaded={isLoaded}>Term</SkeletonLabel>
                <Skeleton rounded="lg" isLoaded={isLoaded}>
                  <Controller
                    name="wordLanguage"
                    control={createMethods.control}
                    render={({ field: { value, onChange } }) => (
                      <LanguageMenuWrapper
                        isOpen={termLangOpen}
                        onClose={() => setTermLangOpen(false)}
                        selected={value}
                        onChange={onChange}
                        isLazy
                      >
                        <PopoverAnchor>
                          <Button
                            onClick={() => setTermLangOpen(true)}
                            variant="outline"
                            size="sm"
                            fontSize="xs"
                            w="full"
                            colorScheme="gray"
                            justifyContent="start"
                            leftIcon={<IconLanguage size={16} />}
                          >
                            {languageName(value)}
                          </Button>
                        </PopoverAnchor>
                      </LanguageMenuWrapper>
                    )}
                  />
                </Skeleton>
              </Stack>
              <Stack w="full" spacing="1">
                <SkeletonLabel isLoaded={isLoaded}>Definition</SkeletonLabel>
                <Skeleton rounded="lg" isLoaded={isLoaded}>
                  <Controller
                    name="definitionLanguage"
                    control={createMethods.control}
                    render={({ field: { value, onChange } }) => (
                      <LanguageMenuWrapper
                        isOpen={defLangOpen}
                        onClose={() => setDefLangOpen(false)}
                        selected={value}
                        onChange={onChange}
                        isLazy
                      >
                        <PopoverAnchor>
                          <Button
                            onClick={() => setDefLangOpen(true)}
                            variant="outline"
                            size="sm"
                            fontSize="xs"
                            w="full"
                            colorScheme="gray"
                            justifyContent="start"
                            leftIcon={<IconLanguage size={16} />}
                          >
                            {languageName(value)}
                          </Button>
                        </PopoverAnchor>
                      </LanguageMenuWrapper>
                    )}
                  />
                </Skeleton>
              </Stack>
            </HStack>
            <Stack spacing="1">
              <SkeletonLabel isLoaded={isLoaded}>Visibility</SkeletonLabel>
              <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
                <Button
                  leftIcon={visibilityIcon(_visibility, 16)}
                  variant="outline"
                  w="calc(50% - 8px)"
                  justifyContent="start"
                  onClick={() => setVisibilityOpen(true)}
                  colorScheme="gray"
                  size="sm"
                  fontSize="xs"
                >
                  {_visibility}
                </Button>
              </Skeleton>
            </Stack>
            <Box
              h="2px"
              w="full"
              rounded="full"
              bg="gray.100"
              _dark={{ bg: "gray.700" }}
            />
            <Skeleton rounded="lg" isLoaded={isLoaded} w="full">
              <Button
                rightIcon={<IconArrowRight size={18} />}
                size="sm"
                w="full"
                type="submit"
                isLoading={createCollaborative.isLoading}
              >
                Create
              </Button>
            </Skeleton>
          </Stack>
          <Box
            w={{ base: "full", sd: "300px", md: "400px", lg: "600px" }}
            h="448px"
            position="relative"
            overflow="hidden"
            rounded="xl"
            py="6"
            pl="6"
          >
            <Card
              w="full"
              h="full"
              minW="700px"
              rounded="xl"
              roundedRight="0"
              shadow="lg"
              bg="gray.50"
              borderColor="gray.200"
              _dark={{
                bg: "gray.900",
                borderColor: "gray.750",
              }}
              borderWidth="2px"
              p="5"
              overflow="hidden"
              pointerEvents="none"
              userSelect="none"
            >
              <Skeleton rounded="xl" isLoaded={isLoaded}>
                <Stack spacing="5">
                  <Stack>
                    <HStack
                      p="3px"
                      px="8px"
                      borderWidth="1px"
                      borderColor="gray.300"
                      color="blue.600"
                      _dark={{
                        color: "blue.100",
                        borderColor: "gray.600",
                      }}
                      rounded="full"
                      w="max"
                      spacing="6px"
                    >
                      <IconUsersGroup size={14} />
                      <Text fontWeight={600} fontSize="xs">
                        Collab
                      </Text>
                    </HStack>
                    <Heading fontSize="3xl">
                      {!!_title.trim().length ? _title.trim() : "Untitled"}
                    </Heading>
                    <HStack
                      color="gray.600"
                      _dark={{
                        color: "gray.400",
                      }}
                      fontWeight={600}
                      fontSize="xs"
                      spacing="6px"
                    >
                      <HStack spacing="6px">
                        {visibilityIcon(_visibility, 16)}
                        <Text>{_visibility}</Text>
                      </HStack>
                      <Text>•</Text>
                      <Text>60 terms</Text>
                    </HStack>
                  </Stack>
                  <Flex gap="6">
                    <Stack minW="120px" spacing="3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Box
                          w="full"
                          bg="white"
                          borderBottomWidth="2px"
                          borderColor="gray.200"
                          _dark={{
                            bg: "gray.750",
                            borderColor: "gray.700",
                          }}
                          rounded="10px"
                          shadow="md"
                          key={i}
                          p="3"
                        >
                          <HStack>
                            <Box
                              w="18px"
                              h="18px"
                              rounded="md"
                              bg="gray.100"
                              _dark={{
                                bg: "gray.700",
                              }}
                            />
                            <Box
                              h="12px"
                              w="50px"
                              rounded="md"
                              bg="gray.200"
                              _dark={{
                                bg: "gray.600",
                              }}
                            />
                          </HStack>
                        </Box>
                      ))}
                    </Stack>
                    <Box
                      flex="1"
                      minW="400px"
                      bg="white"
                      shadow="xl"
                      rounded="xl"
                      _dark={{
                        bg: "gray.700",
                      }}
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        w="50%"
                        h="2px"
                        bg="orange.300"
                        position="absolute"
                        top="0"
                        left="0"
                      />
                    </Box>
                  </Flex>
                </Stack>
              </Skeleton>
            </Card>
          </Box>
        </HStack>
      </form>
    </ClassWizardLayout>
  );
};
