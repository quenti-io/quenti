import { zodResolver } from "@hookform/resolvers/zod";
import { type JSONContent, useEditor } from "@tiptap/react";
import { useRouter } from "next/router";
import React from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { IconEditCircle } from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { ConfirmModal } from "../../../components/confirm-modal";
import { SkeletonLabel } from "../../../components/skeleton-label";
import { Toast } from "../../../components/toast";
import { useAssignment } from "../../../hooks/use-assignment";
import { trimHTML } from "../../../utils/editor";
import { CollabTermsSlider } from "../assignments/editor/collab-terms-slider";
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
  collab: {
    collabMinTerms: number;
    collabMaxTerms: number;
  };
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
    collab: z.object({
      collabMinTerms: z.number().min(1).max(20),
      collabMaxTerms: z.number().min(1).max(20),
    }),
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
  const router = useRouter();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;
  const { data: assignment } = useAssignment();
  const utils = api.useUtils();

  const toast = useToast();

  const [mounted, setMounted] = React.useState(false);
  const [confirmSection, setConfirmSection] = React.useState(false);
  const confirmSectionRef = React.useRef(confirmSection);
  confirmSectionRef.current = confirmSection;

  const [confirmSectionOpen, setConfirmSectionOpen] = React.useState(false);

  const isLoaded = useProtectedRedirect();

  const defaultObj = {
    ...assignment,
    sectionId: assignment?.section.id,
    description: undefined,
    availableAt: assignment?.availableAt as unknown as string,
    dueAt: assignment?.dueAt as unknown as string,
    lockedAt: assignment?.lockedAt as unknown as string,
    collab: {
      collabMinTerms: assignment?.studySet?.collab?.minTermsPerUser ?? 3,
      collabMaxTerms: assignment?.studySet?.collab?.maxTermsPerUser ?? 7,
    },
  };

  const editMethods = useForm<EditAssignmentFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: defaultObj,
  });

  const _sectionId = editMethods.watch("sectionId");
  const sectionDirty = _sectionId !== assignment?.section.id;

  const { collabMinTerms: _minTerms, collabMaxTerms: _maxTerms } =
    editMethods.watch("collab");

  const collab = assignment?.studySet?.collab;
  const collabDirty =
    collab &&
    (_minTerms !== collab.minTermsPerUser ||
      _maxTerms !== collab.maxTermsPerUser);

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "p-4 focus:outline-none",
      },
    },
  });

  const reset = () => {
    editMethods.reset(defaultObj);
    editor?.commands.setContent(assignment?.description as JSONContent);
  };

  React.useEffect(() => {
    if (mounted || !assignment || !editor) return;
    setMounted(true);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, editor]);

  const apiEditCollab = api.assignments.editCollab.useMutation();
  const apiEdit = api.assignments.edit.useMutation({
    onSuccess: async () => {
      await router.push(`/a/${id}/${assignmentId}`);

      toast({
        title: "Saved assignment successfully",
        status: "success",
        colorScheme: "green",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });

      await utils.assignments.get.invalidate();
    },
  });

  const onSubmit: SubmitHandler<EditAssignmentFormInputs> = async (data) => {
    if (sectionDirty && confirmSectionRef.current !== true) {
      setConfirmSectionOpen(true);
      return;
    }

    if (collabDirty) {
      await apiEditCollab.mutateAsync({
        id: assignment?.studySet?.collab?.id || "",
        type: "Default",
        minTermsPerUser: data.collab.collabMinTerms,
        maxTermsPerUser: data.collab.collabMaxTerms,
      });
    }

    await apiEdit.mutateAsync({
      ...data,
      classId: id,
      id: assignmentId,
      availableAt: new Date(data.availableAt),
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      lockedAt: data.lockedAt ? new Date(data.lockedAt) : null,
      description: editor ? trimHTML(editor.getHTML()) : undefined,
    });
  };

  return (
    <FormProvider {...editMethods}>
      <ConfirmModal
        isOpen={confirmSectionOpen}
        onClose={() => setConfirmSectionOpen(false)}
        heading="Change assignment section"
        body="Changing this assignment's section will reset all student submissions. Are you sure you want to continue?"
        isLoading={apiEdit.isLoading || apiEditCollab.isLoading}
        onConfirm={async () => {
          setConfirmSection(true);
          await editMethods.handleSubmit(onSubmit)();
        }}
      />
      <form
        onSubmit={editMethods.handleSubmit(onSubmit)}
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
                    <Button variant="ghost" onClick={reset}>
                      Reset
                    </Button>
                  </Skeleton>
                  <Skeleton rounded="lg" isLoaded={isLoaded}>
                    <Button
                      type="submit"
                      isLoading={apiEdit.isLoading || apiEditCollab.isLoading}
                    >
                      Save changes
                    </Button>
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
            <Skeleton rounded="lg" isLoaded={isLoaded} w="full" h="246px">
              <DescriptionEditor editor={editor} />
            </Skeleton>
          </Stack>
          {(!assignment || assignment.studySet?.collab) && (
            <Controller
              control={editMethods.control}
              name="collab"
              render={({ field: { value, onChange } }) => (
                <CollabTermsSlider
                  minTerms={value.collabMinTerms}
                  maxTerms={value.collabMaxTerms}
                  onChange={(min, max) => {
                    onChange({ collabMinTerms: min, collabMaxTerms: max });
                  }}
                />
              )}
            />
          )}
        </Stack>
      </form>
    </FormProvider>
  );
};
