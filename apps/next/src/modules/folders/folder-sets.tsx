import { useSession } from "next-auth/react";
import React from "react";

import { api } from "@quenti/trpc";

import { Button, Grid, GridItem } from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { AddEntitiesModal } from "../../components/add-entities-modal";
import { GenericCard } from "../../components/generic-card";
import { StudySetCard } from "../../components/study-set-card";
import { useFolder } from "../../hooks/use-folder";
import { FolderCreatorOnly } from "./folder-creator-only";

export const FolderSets = () => {
  const utils = api.useUtils();
  const session = useSession();
  const folder = useFolder();

  const [hasOpenedSets, setHasOpenedSets] = React.useState(false);
  const [addSetsModalOpen, setAddSetsModalOpen] = React.useState(false);
  const amCreator = folder.user.id === session.data?.user?.id;

  const recentForAdd = api.studySets.recent.useQuery(
    {
      exclude: folder.sets.map((x) => x.id),
    },
    {
      enabled: hasOpenedSets,
    },
  );

  const addSets = api.folders.addSets.useMutation({
    onSuccess: async () => {
      setAddSetsModalOpen(false);
      await utils.folders.get.invalidate();
    },
  });

  const removeSet = api.folders.removeSet.useMutation({
    onSuccess: async () => {
      await utils.folders.invalidate();
    },
  });

  return (
    <>
      <AddEntitiesModal
        isOpen={addSetsModalOpen}
        onClose={() => setAddSetsModalOpen(false)}
        actionLabel="Add sets"
        isAddLoading={addSets.isLoading}
        isEntitiesLoading={recentForAdd.isLoading}
        entities={(recentForAdd.data ?? []).map((s) => ({
          ...s,
          entityType: "set",
          numItems: s._count.terms,
          slug: "",
        }))}
        onAdd={async (ids) => {
          await addSets.mutateAsync({
            folderId: folder.id,
            studySetIds: ids,
          });
        }}
      />
      <Grid
        templateColumns="repeat(auto-fill, minmax(256px, 1fr))"
        gap={4}
        w="full"
      >
        {folder.sets.map((studySet) => (
          <GridItem key={studySet.id}>
            <StudySetCard
              studySet={studySet}
              user={studySet.user}
              numTerms={studySet._count.terms}
              collaborators={studySet.collaborators}
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
                setHasOpenedSets(true);
              }}
            >
              Add sets
            </Button>
          </GridItem>
        </FolderCreatorOnly>
      </Grid>
    </>
  );
};

FolderSets.Skeleton = function FolderSetsSkeleton() {
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(256px, 1fr))"
      gap={4}
      w="full"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <GridItem key={i}>
          <GenericCard.Skeleton />
        </GridItem>
      ))}
    </Grid>
  );
};
