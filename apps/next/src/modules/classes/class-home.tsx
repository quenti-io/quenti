import { Stack } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import React from "react";
import { AddEntitiesModal } from "../../components/add-entities-modal";
import { FolderCard } from "../../components/folder-card";
import { StudySetCard } from "../../components/study-set-card";
import { useClass } from "../../hooks/use-class";
import { useIsClassTeacher } from "../../hooks/use-is-class-teacher";
import { EntityGroup } from "./entity-group";

export const ClassHome = () => {
  const { data } = useClass();
  const isTeacher = useIsClassTeacher();

  const [addFoldersOpen, setAddFoldersOpen] = React.useState(false);
  const [addSetsOpen, setAddSetsOpen] = React.useState(false);

  const recentFolders = api.folders.recent.useQuery(
    {
      exclude: data?.folders.map((x) => x.id),
    },
    {
      enabled: addFoldersOpen,
    }
  );
  const recentSets = api.studySets.recent.useQuery(
    {
      exclude: data?.studySets.map((x) => x.id),
    },
    {
      enabled: addSetsOpen,
    }
  );

  return (
    <>
      <AddEntitiesModal
        isOpen={addFoldersOpen}
        onClose={() => setAddFoldersOpen(false)}
        entities={(recentFolders.data ?? []).map((f) => ({
          ...f,
          type: "folder",
          numItems: f._count.studySets,
        }))}
        onAdd={() => undefined}
        actionLabel={"Add folders"}
        isEntitiesLoading={recentFolders.isLoading}
      />
      <AddEntitiesModal
        isOpen={addSetsOpen}
        onClose={() => setAddSetsOpen(false)}
        entities={(recentSets.data ?? []).map((s) => ({
          ...s,
          type: "set",
          numItems: s._count.terms,
          slug: "",
        }))}
        onAdd={() => undefined}
        actionLabel={"Add sets"}
        isEntitiesLoading={recentSets.isLoading}
      />
      <Stack spacing="6">
        {(!data || !!data.folders.length || isTeacher) && (
          <EntityGroup
            heading="Folders"
            isLoaded={!!data}
            onRequestAdd={() => setAddFoldersOpen(true)}
          >
            {data?.folders?.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                numSets={folder._count.studySets}
                user={folder.user}
                removable={isTeacher}
              />
            ))}
          </EntityGroup>
        )}
        {(!data || !!data.studySets.length || isTeacher) && (
          <EntityGroup
            heading="Study sets"
            isLoaded={!!data}
            onRequestAdd={() => setAddSetsOpen(true)}
          >
            {data?.studySets?.map((studySet) => (
              <StudySetCard
                key={studySet.id}
                studySet={studySet}
                numTerms={studySet._count.terms}
                user={studySet.user}
                removable={isTeacher}
              />
            ))}
          </EntityGroup>
        )}
      </Stack>
    </>
  );
};
