import React from "react";
import { RootFlashcardContext } from "../components/root-flashcard-wrapper";
import { queryEventChannel } from "../events/query";
import { useDidUpdate } from "../hooks/use-did-update";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import type { StudiableTerm } from "../interfaces/studiable-term";
import { ExperienceContext } from "../stores/use-experience-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
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
  const { termOrder } = React.useContext(RootFlashcardContext);
  const experienceStore = React.useContext(ExperienceContext);
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
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

    let flashcardTerms: StudiableTerm[] = termOrder.map((id) => {
      const term = terms.find((t) => t.id === id)!;
      const studiableTerm = studiable.find((s) => s.id === term.id);
      return {
        ...term,
        correctness: studiableTerm?.correctness ?? 0,
        appearedInRound: studiableTerm?.appearedInRound ?? undefined,
        incorrectCount: studiableTerm?.incorrectCount ?? 0,
      };
    });

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

  useDidUpdate(() => {
    experienceStore?.subscribe(
      (s) => s.shuffleFlashcards,
      () => {
        requestAnimationFrame(() => {
          setIsDirty(true);
        });
      }
    );
  }, []);

  React.useEffect(() => {
    const trigger = (data: SetData | FolderData) =>
      initState(data.experience, data.terms);

    queryEventChannel.on("setQueryRefetched", trigger);
    queryEventChannel.on("folderQueryRefetched", trigger);
    return () => {
      queryEventChannel.off("setQueryRefetched", trigger);
      queryEventChannel.off("folderQueryRefetched", trigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SortFlashcardsContext.Provider value={storeRef.current}>
      {children}
    </SortFlashcardsContext.Provider>
  );
};
