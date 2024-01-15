import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor } from "@tiptap/react";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Flex, Skeleton, Stack } from "@chakra-ui/react";

import { SkeletonLabel } from "../../../components/skeleton-label";
import { useClass } from "../../../hooks/use-class";
import { trimHTML } from "../../../utils/editor";
import { DatesSection } from "../assignments/editor/dates-section";
import {
  DescriptionEditor,
  extensions,
} from "../assignments/editor/description-editor";
import { TitleSectionArea } from "../assignments/editor/title-section-area";
import { TypeSection } from "../assignments/editor/type-section";
import { ClassWizardLayout } from "../class-wizard-layout";
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

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "p-4 focus:outline-none",
      },
    },
  });

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
      description: editor ? trimHTML(editor.getHTML()) : undefined,
    });
  };

  return (
    <ClassWizardLayout
      title="New assignment"
      seoTitle="New assignment"
      currentStep={0}
      steps={4}
      description=""
    >
      <FormProvider {...createMethods}>
        <form
          onSubmit={createMethods.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <Stack spacing="8">
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
      </FormProvider>
    </ClassWizardLayout>
  );
};
