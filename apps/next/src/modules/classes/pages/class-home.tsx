import React from "react";

import { api } from "@quenti/trpc";

import { GridItem, Stack } from "@chakra-ui/react";

import { AddEntitiesModal } from "../../../components/add-entities-modal";
import { FolderCard } from "../../../components/folder-card";
import { StudySetCard } from "../../../components/study-set-card";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { EmptyMessage } from "../empty-message";
import { EntityGroup } from "../home/entity-group";
import { InviteBanner } from "../home/invite-banner";

export const ClassHome = () => {
  const utils = api.useUtils();
  const { data } = useClass();
  const isTeacher = useIsClassTeacher();

  const [hasOpenedFolders, setHasOpenedFolders] = React.useState(false);
  const [addFoldersOpen, setAddFoldersOpen] = React.useState(false);
  const [hasOpenedSets, setHasOpenedSets] = React.useState(false);
  const [addSetsOpen, setAddSetsOpen] = React.useState(false);

  const recentFolders = api.folders.recent.useQuery(
    {
      exclude: data?.folders.map((x) => x.id),
    },
    {
      enabled: hasOpenedFolders,
    },
  );
  const recentSets = api.studySets.recent.useQuery(
    {
      exclude: data?.studySets.map((x) => x.id),
    },
    {
      enabled: hasOpenedSets,
    },
  );

  const addEntities = api.classes.addEntities.useMutation({
    onSuccess: async () => {
      setAddFoldersOpen(false);
      setAddSetsOpen(false);
      await utils.classes.get.invalidate();
    },
  });

  const removeEntity = api.classes.removeEntity.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
    },
  });

  return (
    <>
      <AddEntitiesModal
        isOpen={addFoldersOpen}
        onClose={() => setAddFoldersOpen(false)}
        entities={(recentFolders.data ?? []).map((f) => ({
          ...f,
          entityType: "folder",
          numItems: f._count.studySets,
        }))}
        onAdd={(ids) =>
          addEntities.mutate({
            classId: data!.id,
            entities: ids,
            type: "Folder",
          })
        }
        actionLabel={"Add folders"}
        isEntitiesLoading={recentFolders.isLoading}
        isAddLoading={addEntities.isLoading}
      />
      <AddEntitiesModal
        isOpen={addSetsOpen}
        onClose={() => setAddSetsOpen(false)}
        entities={(recentSets.data ?? []).map((s) => ({
          ...s,
          entityType: "set",
          numItems: s._count.terms,
          slug: "",
        }))}
        onAdd={(ids) =>
          addEntities.mutate({
            classId: data!.id,
            entities: ids,
            type: "StudySet",
          })
        }
        actionLabel={"Add sets"}
        isEntitiesLoading={recentSets.isLoading}
        isAddLoading={addEntities.isLoading}
      />
      <Stack spacing="6">
        {isTeacher && !data?.students && <InviteBanner />}
        {(!data || !!data.folders.length || isTeacher) && (
          <EntityGroup
            heading="Folders"
            isLoaded={!!data}
            onRequestAdd={() => {
              setAddFoldersOpen(true);
              setHasOpenedFolders(true);
            }}
            type="folder"
          >
            {data?.folders?.map((folder) => (
              <GridItem key={folder.id}>
                <FolderCard
                  folder={folder}
                  numSets={folder._count.studySets}
                  user={folder.user}
                  removable={isTeacher}
                  onRemove={() =>
                    removeEntity.mutate({
                      classId: data.id,
                      entityId: folder.id,
                      type: "Folder",
                    })
                  }
                />
              </GridItem>
            ))}
          </EntityGroup>
        )}
        {(!data || !!data.studySets.length || isTeacher) && (
          <EntityGroup
            heading="Study sets"
            isLoaded={!!data}
            onRequestAdd={() => {
              setAddSetsOpen(true);
              setHasOpenedSets(true);
            }}
            type="studySet"
          >
            {data?.studySets?.map((studySet) => (
              <GridItem key={studySet.id}>
                <StudySetCard
                  studySet={studySet}
                  numTerms={studySet._count.terms}
                  user={studySet.user}
                  removable={isTeacher}
                  collaborators={studySet.collaborators}
                  onRemove={() =>
                    removeEntity.mutate({
                      classId: data.id,
                      entityId: studySet.id,
                      type: "StudySet",
                    })
                  }
                />
              </GridItem>
            ))}
          </EntityGroup>
        )}
        {data &&
          !isTeacher &&
          !data.folders.length &&
          !data.studySets.length && <EmptyMessage />}
      </Stack>
    </>
  );
};
