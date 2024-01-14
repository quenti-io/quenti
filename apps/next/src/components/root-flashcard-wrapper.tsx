import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";

import type { FacingTerm } from "@quenti/interfaces";
import { api } from "@quenti/trpc";

import { Box } from "@chakra-ui/react";

import { menuEventChannel } from "../events/menu";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { CreateSortFlashcardsData } from "../modules/create-sort-flashcards-data";
import { useContainerContext } from "../stores/use-container-store";
import { DefaultFlashcardWrapper } from "./default-flashcard-wrapper";
import { FlashcardsEmpty } from "./flashcards-empty";
import { LoadingFlashcard } from "./loading-flashcard";
import { SortFlashcardWrapper } from "./sort-flashcard-wrapper";

const EditTermModal = dynamic(
  () => import("./edit-term-modal").then((mod) => mod.EditTermModal),
  { ssr: false },
);

export interface RootFlashcardWrapperProps {
  terms: FacingTerm[];
  termOrder: string[];
  h?: string;
  isDirty?: boolean;
}

interface RootFlashcardContextProps {
  terms: FacingTerm[];
  termOrder: string[];
  h?: string;
  editTerm: (term: FacingTerm, focusDefinition: boolean) => void;
  starTerm: (term: FacingTerm) => void;
}

export const RootFlashcardContext =
  React.createContext<RootFlashcardContextProps>({
    terms: [],
    termOrder: [],
    editTerm: () => undefined,
    starTerm: () => undefined,
  });

export const RootFlashcardWrapper: React.FC<RootFlashcardWrapperProps> = ({
  terms,
  termOrder,
  h = "500px",
  isDirty = false,
}) => {
  const authed = useSession().status == "authenticated";
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editTerm, setEditTerm] = React.useState<FacingTerm | null>(null);
  const [focusDefinition, setFocusDefinition] = React.useState(false);

  const setStarMutation = api.container.starTerm.useMutation();
  const folderStarMutation = api.folders.starTerm.useMutation();
  const unstarMutation = api.container.unstarTerm.useMutation();

  const { entityType, container } = useSetFolderUnison();
  const enableCardsSorting = useContainerContext((s) => s.enableCardsSorting);
  const starredTerms = useContainerContext((s) => s.starredTerms);
  const starTerm = useContainerContext((s) => s.starTerm);
  const unstarTerm = useContainerContext((s) => s.unstarTerm);

  const FlashcardWrapper = enableCardsSorting
    ? SortFlashcardWrapper
    : DefaultFlashcardWrapper;

  const Wrapper = authed ? CreateSortFlashcardsData : React.Fragment;

  if (isDirty || (!termOrder.length && !container))
    return <LoadingFlashcard h={h} />;
  if (!termOrder.length) return <FlashcardsEmpty h={h} />;

  return (
    <RootFlashcardContext.Provider
      value={{
        terms,
        termOrder,
        h,
        editTerm: (term, focusDefinition) => {
          setEditTerm(term);
          setFocusDefinition(focusDefinition);
          setEditModalOpen(true);
        },
        starTerm: (term) => {
          if (!authed) {
            menuEventChannel.emit("openSignup", {
              message: "Create an account for free to customize and star terms",
            });
            return;
          }

          if (!starredTerms.includes(term.id)) {
            if (entityType === "set") {
              setStarMutation.mutate({
                termId: term.id,
                containerId: container.id,
              });
            } else {
              folderStarMutation.mutate({
                termId: term.id,
                studySetId: term.studySetId,
              });
            }

            starTerm(term.id);
          } else {
            unstarMutation.mutate({
              termId: term.id,
            });
            unstarTerm(term.id);
          }
        },
      }}
    >
      <Wrapper>
        <Box w="full" minH={h} zIndex="100">
          <EditTermModal
            term={editTerm}
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
            }}
            onDefinition={focusDefinition}
          />
          <FlashcardWrapper />
        </Box>
      </Wrapper>
    </RootFlashcardContext.Provider>
  );
};
