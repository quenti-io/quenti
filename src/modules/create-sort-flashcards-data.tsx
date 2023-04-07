import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import type { StudiableTerm } from "../interfaces/studiable-term";
import {
  createSortFlashcardsStore,
  SortFlashcardsContext,
  type SortFlashcardsStore,
} from "../stores/use-sort-flashcards-store";

export const CreateSortFlashcardsData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, experience } = useSetFolderUnison();

  const storeRef = React.useRef<SortFlashcardsStore>();
  if (!storeRef.current) {
    storeRef.current = createSortFlashcardsStore();

    if (!experience.studiableTerms)
      throw new Error("Studiable terms missing from experience!");
    const studiable = experience.studiableTerms.filter(
      (s) => s.mode == "Flashcards"
    );

    let flashcardTerms: StudiableTerm[] = terms
      .map((term) => {
        const studiableTerm = studiable.find((s) => s.id === term.id);
        return {
          ...term,
          correctness: studiableTerm?.correctness ?? 0,
          appearedInRound: studiableTerm?.appearedInRound ?? undefined,
          incorrectCount: studiableTerm?.incorrectCount ?? 0,
        };
      })
      .sort((a, b) => a.rank - b.rank);

    if (experience.cardsStudyStarred) {
      flashcardTerms = flashcardTerms.filter((x) =>
        experience.starredTerms.includes(x.id)
      );
    }

    storeRef.current
      .getState()
      .initialize(experience.cardsRound, flashcardTerms, terms);
  }

  return (
    <SortFlashcardsContext.Provider value={storeRef.current}>
      {children}
    </SortFlashcardsContext.Provider>
  );
};
