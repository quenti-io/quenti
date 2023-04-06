import { Box } from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { useExperienceContext } from "../stores/use-experience-store";
import { api } from "../utils/api";
import { DefaultFlashcardWrapper } from "./default-flashcard-wrapper";
import { EditTermModal } from "./edit-term-modal";

export interface RootFlashcardWrapperProps {
  terms: Term[];
  termOrder: string[];
  h?: string;
}

interface RootFlashcardContextProps {
  terms: Term[];
  termOrder: string[];
  h?: string;
  editTerm: (term: Term, focusDefinition: boolean) => void;
  starTerm: (term: Term) => void;
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
}) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editTerm, setEditTerm] = React.useState<Term | null>(null);
  const [focusDefinition, setFocusDefinition] = React.useState(false);

  const setStarMutation = api.experience.starTerm.useMutation();
  const folderStarMutation = api.folders.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const { type, experience } = useSetFolderUnison();
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

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
          if (!starredTerms.includes(term.id)) {
            if (type === "set") {
              setStarMutation.mutate({
                termId: term.id,
                experienceId: experience.id,
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
      <Box w="full" h={h} zIndex="100">
        <EditTermModal
          term={editTerm}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
          }}
          onDefinition={focusDefinition}
        />
        <DefaultFlashcardWrapper />
      </Box>
    </RootFlashcardContext.Provider>
  );
};
