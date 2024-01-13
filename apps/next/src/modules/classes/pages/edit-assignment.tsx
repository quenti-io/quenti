import { zodResolver } from "@hookform/resolvers/zod";
import { type JSONContent, useEditor } from "@tiptap/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Stack,
} from "@chakra-ui/react";

import { IconEditCircle } from "@tabler/icons-react";

import { SkeletonLabel } from "../../../components/skeleton-label";
import { useAssignment } from "../../../hooks/use-assignment";
import { DatesSection } from "../assignments/editor/dates-section";
import {
  DescriptionEditor,
  extensions,
} from "../assignments/editor/description-editor";
import { TitleSectionArea } from "../assignments/editor/title-section-area";
import { TypeSection } from "../assignments/editor/type-section";
import { useProtectedRedirect } from "../use-protected-redirect";

interface EditAssignmentFormInputs {
  title: string;
  description: string;
  sectionId: string;
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

export const EditAssignment = () => {
  const { data: assignment } = useAssignment();
  const [mounted, setMounted] = React.useState(false);

  const isLoaded = useProtectedRedirect();

  const editMethods = useForm<EditAssignmentFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...assignment,
      sectionId: assignment?.section.id,
      description: undefined,
      availableAt: assignment?.availableAt as unknown as string,
      dueAt: assignment?.dueAt as unknown as string,
      lockedAt: assignment?.lockedAt as unknown as string,
    },
  });

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "p-4 focus:outline-none",
      },
    },
  });

  React.useEffect(() => {
    if (mounted || !assignment || !editor) return;
    setMounted(true);

    editMethods.reset({
      ...assignment,
      sectionId: assignment?.section.id,
      description: undefined,
      availableAt: assignment?.availableAt as unknown as string,
      dueAt: assignment?.dueAt as unknown as string,
      lockedAt: assignment?.lockedAt as unknown as string,
    });

    editor.commands.setContent(assignment.description as JSONContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, editor]);

  return (
    <FormProvider {...editMethods}>
      <form
        // onSubmit={createMethods.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Skeleton fitContent rounded="lg" isLoaded={isLoaded}>
              <HStack
                justifyContent="space-between"
                alignItems={{ base: "start", md: "center" }}
                spacing="6"
                flexDir={{
                  base: "column",
                  md: "row",
                }}
              >
                <HStack>
                  <IconEditCircle />
                  <Heading size="lg">Edit assignment</Heading>
                </HStack>
                <ButtonGroup alignSelf="end" size={{ base: "sm", md: "md" }}>
                  <Skeleton rounded="lg" isLoaded={isLoaded}>
                    <Button variant="ghost">Reset</Button>
                  </Skeleton>
                  <Skeleton rounded="lg" isLoaded={isLoaded}>
                    <Button>Save changes</Button>
                  </Skeleton>
                </ButtonGroup>
              </HStack>
            </Skeleton>
            <Divider
              borderColor="gray.300"
              _dark={{
                borderColor: "gray.600",
              }}
            />
          </Stack>
          <TitleSectionArea />
          <TypeSection />
          <DatesSection />
          <Stack>
            <SkeletonLabel isLoaded={isLoaded}>
              Description (optional)
            </SkeletonLabel>
            <Skeleton rounded="lg" isLoaded={isLoaded} w="full">
              <DescriptionEditor editor={editor} />
            </Skeleton>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
