import { Button, Grid, GridItem } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { StudySetCard } from "../../components/study-set-card";
import { useFolder } from "../../hooks/use-folder";
import { api } from "@quenti/trpc";
import { AddSetsModal } from "./add-sets-modal";
import { FolderCreatorOnly } from "./folder-creator-only";

export const FolderSets = () => {
  const utils = api.useContext();
  const session = useSession();
  const folder = useFolder();

  const [addSetsModalOpen, setAddSetsModalOpen] = React.useState(false);
  const amCreator = folder.user.id === session.data?.user?.id;

  const removeSet = api.folders.removeSet.useMutation({
    onSuccess: async () => {
      await utils.folders.invalidate();
    },
  });

  return (
    <>
      <AddSetsModal
        isOpen={addSetsModalOpen}
        onClose={() => setAddSetsModalOpen(false)}
      />
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {folder.sets.map((studySet) => (
          <GridItem key={studySet.id}>
            <StudySetCard
              studySet={studySet}
              user={studySet.user}
              numTerms={studySet._count.terms}
              removable={amCreator}
              onRemove={() => {
                removeSet.mutate({
                  folderId: folder.id,
                  studySetId: studySet.id,
                });
              }}
            />
          </GridItem>
        ))}
        <FolderCreatorOnly>
          <GridItem>
            <Button
              leftIcon={<IconPlus />}
              variant="outline"
              h="full"
              minH="120"
              w="full"
              onClick={() => {
                setAddSetsModalOpen(true);
              }}
            >
              Add Sets
            </Button>
          </GridItem>
        </FolderCreatorOnly>
      </Grid>
    </>
  );
};
