import React from "react";
import { queryEventChannel } from "../events/query";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import type { StudiableTerm } from "../interfaces/studiable-term";
import {
  createSortFlashcardsStore,
  SortFlashcardsContext,
  type SortFlashcardsStore,
} from "../stores/use-sort-flashcards-store";
import type { RouterOutputs } from "../utils/api";
import type { Widen } from "../utils/widen";
import type { FolderData } from "./hydrate-folder-data";
import type { SetData } from "./hydrate-set-data";

export const CreateSortFlashcardsData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, experience } = useSetFolderUnison();
  const storeRef = React.useRef<SortFlashcardsStore>();

  const initState = (
    experience: Widen<
      SetData["experience"] | RouterOutputs["folders"]["get"]["experience"]
    >,
    terms: SetData["terms"]
  ) => {
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

    storeRef
      .current!.getState()
      .initialize(experience.cardsRound, flashcardTerms, terms);
  };

  if (!storeRef.current) {
    storeRef.current = createSortFlashcardsStore();
    initState(experience, terms);
  }

  React.useEffect(() => {
    const trigger = (data: SetData | FolderData) =>
      initState(data.experience, data.terms);

    queryEventChannel.on("setQueryRefetched", trigger);
    queryEventChannel.on("folderQueryRefetched", trigger);
    return () => {
      queryEventChannel.off("setQueryRefetched", trigger);
      queryEventChannel.off("folderQueryRefetched", trigger);
    };
  }, []);

  return (
    <SortFlashcardsContext.Provider value={storeRef.current}>
      {children}
    </SortFlashcardsContext.Provider>
  );
};
