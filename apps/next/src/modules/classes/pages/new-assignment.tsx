import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { IconHelpCircle } from "@tabler/icons-react";

import { SkeletonLabel } from "../../../components/skeleton-label";
import { useClass } from "../../../hooks/use-class";
import { DescriptionEditor } from "../assignments/new/description-editor";
import { TypeSection } from "../assignments/new/type-section";
import { ClassWizardLayout } from "../class-wizard-layout";
import { DateTimeInput } from "../date-time-input";
import { SectionSelect } from "../section-select";
import { useProtectedRedirect } from "../use-protected-redirect";

interface CreateAssignmentFormInputs {
  title: string;
  description: string;
  sectionId: string;
  type: "Collab";
  availableAt: string;
  dueAt: string | null;
  lockedAt: string | null;
}

const schema = z
  .object({
    title: z
      .string({ required_error: "Enter a title" })
      .trim()
      .min(1, { message: "Enter a title" }),
    description: z.string().default("").optional(),
    sectionId: z.string(),
    type: z.enum(["Collab"]),
    availableAt: z.coerce.date(),
    dueAt: z.coerce.date().optional().nullable(),
    lockedAt: z.coerce.date().optional().nullable(),
  })
  .refine(
    (schema) =>
      schema.dueAt
        ? schema.dueAt.getTime() > schema.availableAt.getTime()
        : true,
    {
      path: ["dueAt"],
      message: "Due date must be after available date",
    },
  )
  .refine(
    (schema) =>
      schema.lockedAt
        ? schema.lockedAt.getTime() > schema.availableAt.getTime()
        : true,
    {
      path: ["lockedAt"],
      message: "Locked date must be after available date",
    },
  )
  .refine(
    (schema) =>
      schema.lockedAt && schema.dueAt
        ? schema.lockedAt.getTime() > schema.dueAt.getTime()
        : true,
    {
      path: ["lockedAt"],
      message: "Locked date must be after due date",
    },
  );

export const NewAssignment = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const isLoaded = useProtectedRedirect();
  const { data: class_ } = useClass();

  const createMethods = useForm<CreateAssignmentFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "Collab",
      availableAt: new Date().toISOString(),
    },
  });
  const {
    formState: { errors },
    watch,
  } = createMethods;

  const _availableAt = watch("availableAt");
  const _dueAt = watch("dueAt");

  React.useEffect(() => {
    if (!isLoaded) return;
    const section = class_?.sections?.[0]?.id;
    if (!section) return;

    createMethods.setValue("sectionId", section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const apiCreate = api.assignments.create.useMutation({
    onSuccess: async (assignment) => {
      await router.push(
        `/classes/${id}/assignments/${assignment.id}/study-set`,
      );
    },
  });

  const onSubmit: SubmitHandler<CreateAssignmentFormInputs> = async (data) => {
    await apiCreate.mutateAsync({
      ...data,
      classId: id,
      availableAt: new Date(data.availableAt),
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      lockedAt: data.lockedAt ? new Date(data.lockedAt) : null,
    });
  };

  return (
    <ClassWizardLayout
      title="New assignment"
      seoTitle="New assignment"
      currentStep={0}
      steps={5}
      description=""
    >
      <form
        onSubmit={createMethods.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Stack spacing="8">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 4 }}>
            <Controller
              name="title"
              control={createMethods.control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.title}>
                  <Stack>
                    <SkeletonLabel isLoaded={isLoaded}>Title</SkeletonLabel>
                    <Skeleton rounded="lg" w="full" isLoaded={isLoaded}>
                      <Input
                        w="full"
                        autoFocus
                        rounded="lg"
                        placeholder="Assignment Title"
                        defaultValue={value}
                        onChange={onChange}
                        bg="white"
                        shadow="sm"
                        _dark={{
                          bg: "gray.800",
                        }}
                      />
                    </Skeleton>
                  </Stack>
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="sectionId"
              control={createMethods.control}
              render={({ field: { value, onChange } }) => (
                <Stack>
                  <SkeletonLabel isLoaded={isLoaded}>Section</SkeletonLabel>
                  <Skeleton
                    rounded="lg"
                    isLoaded={isLoaded}
                    w="full"
                    maxW="200px"
                  >
                    <SectionSelect
                      value={value}
                      onChange={onChange}
                      sections={class_?.sections ?? []}
                      size="md"
                    />
                  </Skeleton>
                </Stack>
              )}
            />
          </SimpleGrid>
          <TypeSection />
          <Stack spacing="8" mt="6">
            <Flex
              gap="6"
              display={{ base: "grid", lg: "flex" }}
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            >
              <Controller
                name="availableAt"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <Stack w="max">
                    <SkeletonLabel isLoaded={isLoaded}>
                      Available at
                    </SkeletonLabel>
                    <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                      <DateTimeInput
                        value={value}
                        onChange={onChange}
                        minDate={dayjs().startOf("day").toISOString()}
                        inputStyles={{
                          w: { base: "full", sm: "244px" },
                        }}
                      />
                    </Skeleton>
                  </Stack>
                )}
              />
              <DateDivider />
              <Controller
                name="dueAt"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.dueAt} w="max">
                    <Stack>
                      <SkeletonLabel isLoaded={isLoaded}>
                        Due at (optional)
                      </SkeletonLabel>
                      <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                        <DateTimeInput
                          value={value}
                          onChange={onChange}
                          placeholder="Set due date"
                          minDate={_availableAt}
                          inputStyles={{
                            w: { base: "full", sm: "244px" },
                          }}
                          nullable
                        />
                      </Skeleton>
                    </Stack>
                    <FormErrorMessage>{errors.dueAt?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <DateDivider />
              <Controller
                name="lockedAt"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.lockedAt} w="max">
                    <Stack>
                      <SkeletonLabel isLoaded={isLoaded}>
                        <HStack>
                          <Text>Locked at (optional)</Text>
                          <Tooltip
                            label="Students will not be able to submit or make any changes after this date."
                            placement="top"
                            p="2"
                            px="3"
                          >
                            <Box color="gray.500">
                              <IconHelpCircle size={16} />
                            </Box>
                          </Tooltip>
                        </HStack>
                      </SkeletonLabel>
                      <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                        <DateTimeInput
                          value={value}
                          onChange={onChange}
                          minDate={_dueAt ?? _availableAt}
                          placeholder="Set lock date"
                          inputStyles={{
                            w: { base: "full", sm: "244px" },
                          }}
                          nullable
                        />
                      </Skeleton>
                    </Stack>
                    <FormErrorMessage>
                      {errors.lockedAt?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
            </Flex>
          </Stack>
          <Stack>
            <SkeletonLabel isLoaded={isLoaded}>
              Description (optional)
            </SkeletonLabel>
            <Skeleton rounded="lg" isLoaded={isLoaded} w="full">
              <DescriptionEditor />
            </Skeleton>
          </Stack>
          <Flex w="full" justifyContent="end">
            <ButtonGroup>
              <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
                <Button
                  variant="ghost"
                  colorScheme="gray"
                  onClick={async () => {
                    await router.push(`/classes/${id}/assignments`);
                  }}
                >
                  Cancel
                </Button>
              </Skeleton>
              <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
                <Button type="submit" isLoading={apiCreate.isLoading}>
                  Continue
                </Button>
              </Skeleton>
            </ButtonGroup>
          </Flex>
        </Stack>
      </form>
    </ClassWizardLayout>
  );
};

const DateDivider = () => (
  <Center display={{ base: "none", lg: "inherit" }} w="2px" h="61px">
    <Box
      w="2px"
      bg="gray.200"
      _dark={{ bg: "gray.700" }}
      h="56px"
      rounded="full"
    />
  </Center>
);
