import React from "react";

import { api } from "@quenti/trpc";

import { Button, Skeleton, Stack } from "@chakra-ui/react";

import { IconNewSection } from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { useClass } from "../../hooks/use-class";
import { plural } from "../../utils/string";
import { SettingsWrapper } from "../organizations/settings-wrapper";
import { AddSectionModal } from "./add-section-modal";
import { ClassJoinCodeModal } from "./class-join-code-modal";
import { EditSectionModal } from "./edit-section-modal";
import { SectionCard } from "./section-card";
import { useProtectedRedirect } from "./use-protected-redirect";

export const ClassSections = () => {
  const utils = api.useUtils();
  const { data } = useClass();
  const isLoaded = useProtectedRedirect();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | undefined>();
  const [joinId, setJoinId] = React.useState<string | undefined>();
  const toDelete = data?.sections?.find((s) => s.id === deleteId);

  const deleteSection = api.classes.deleteSection.useMutation({
    onSuccess: async () => {
      setDeleteId(undefined);
      await utils.classes.get.invalidate();
    },
  });

  return (
    <>
      {isLoaded && (
        <>
          <AddSectionModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
          <EditSectionModal
            isOpen={!!editId}
            onClose={() => setEditId(undefined)}
            sectionId={editId}
          />
          <ClassJoinCodeModal
            isOpen={!!joinId}
            onClose={() => setJoinId(undefined)}
            sectionId={joinId}
          />
          <ConfirmModal
            isOpen={!!deleteId}
            onClose={() => setDeleteId(undefined)}
            heading={`Delete ${toDelete?.name || "section"}`}
            body={`Are you sure you want to delete this section? ${
              !!toDelete?.students
                ? `${plural(
                    toDelete?.students || 0,
                    "student",
                  )} will be unassigned.`
                : ""
            }`}
            actionText="Delete section"
            onConfirm={() =>
              deleteSection.mutate({ classId: data!.id, sectionId: deleteId! })
            }
            isLoading={deleteSection.isLoading}
            destructive
          />
        </>
      )}
      <SettingsWrapper
        heading="Sections"
        description="Manage up to ten sections for your class"
        isLoaded={!!isLoaded}
      >
        <Stack spacing="2" maxW="sm">
          {!isLoaded
            ? Array.from({ length: 2 }).map((_, i) => (
                <SectionCard key={i} name="placeholder" students={0} skeleton />
              ))
            : data!.sections!.map((section) => (
                <SectionCard
                  key={section.id}
                  name={section.name}
                  students={section.students}
                  onRequestEdit={() => setEditId(section.id)}
                  onRequestDelete={() => setDeleteId(section.id)}
                  onRequestJoinCode={() => setJoinId(section.id)}
                />
              ))}
          {(data?.sections?.length || 0) < 10 && (
            <Skeleton w="full" mt="2" rounded="md" isLoaded={isLoaded}>
              <Button
                variant="outline"
                w="full"
                leftIcon={<IconNewSection size={18} />}
                colorScheme="gray"
                onClick={() => setAddOpen(true)}
              >
                Add section
              </Button>
            </Skeleton>
          )}
        </Stack>
      </SettingsWrapper>
    </>
  );
};
