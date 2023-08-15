import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type {
  LimitedStudySetAnswerMode,
  MultipleAnswerMode,
  StudySetAnswerMode,
} from "@quenti/prisma/client";

export interface ContainerStoreProps {
  shuffleFlashcards: boolean;
  autoplayFlashcards: boolean;
  shuffleLearn: boolean;
  studyStarred: boolean;
  answerWith: StudySetAnswerMode;
  multipleAnswerMode: MultipleAnswerMode;
  extendedFeedbackBank: boolean;
  enableCardsSorting: boolean;
  cardsStudyStarred: boolean;
  cardsAnswerWith: LimitedStudySetAnswerMode;
  matchStudyStarred: boolean;
  starredTerms: string[];
}

interface ContainerState extends ContainerStoreProps {
  toggleShuffleFlashcards: () => void;
  toggleAutoplayFlashcards: () => void;
  setShuffleLearn: (shuffleLearn: boolean) => void;
  setStudyStarred: (studyStarred: boolean) => void;
  setAnswerWith: (answerWith: StudySetAnswerMode) => void;
  setMultipleAnswerMode: (multipleAnswerMode: MultipleAnswerMode) => void;
  setExtendedFeedbackBank: (extendedFeedbackBank: boolean) => void;
  setEnableCardsSorting: (enableCardsSorting: boolean) => void;
  setCardsStudyStarred: (cardsStudyStarred: boolean) => void;
  setCardsAnswerWith: (cardsAnswerWith: LimitedStudySetAnswerMode) => void;
  setMatchStudyStarred: (matchStudyStarred: boolean) => void;
  starTerm: (termId: string) => void;
  unstarTerm: (termId: string) => void;
}

export type ContainerStore = ReturnType<typeof createContainerStore>;

export const createContainerStore = (
  initProps?: Partial<ContainerStoreProps>,
) => {
  const DEFAULT_PROPS: ContainerStoreProps = {
    shuffleFlashcards: false,
    autoplayFlashcards: false,
    shuffleLearn: false,
    studyStarred: false,
    answerWith: "Definition",
    extendedFeedbackBank: false,
    multipleAnswerMode: "Unknown",
    cardsAnswerWith: "Definition",
    cardsStudyStarred: false,
    enableCardsSorting: false,
    matchStudyStarred: false,
    starredTerms: [],
  };

  return createStore<ContainerState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      toggleShuffleFlashcards: () => {
        set((state) => {
          return {
            shuffleFlashcards: !state.shuffleFlashcards,
          };
        });
      },
      toggleAutoplayFlashcards: () => {
        set((state) => {
          return {
            autoplayFlashcards: !state.autoplayFlashcards,
          };
        });
      },
      setShuffleLearn: (shuffleLearn: boolean) => set({ shuffleLearn }),
      setStudyStarred: (studyStarred: boolean) => set({ studyStarred }),
      setAnswerWith: (answerWith: StudySetAnswerMode) => set({ answerWith }),
      setMultipleAnswerMode: (multipleAnswerMode: MultipleAnswerMode) =>
        set({ multipleAnswerMode }),
      setExtendedFeedbackBank: (extendedFeedbackBank: boolean) =>
        set({ extendedFeedbackBank }),
      setEnableCardsSorting: (enableCardsSorting: boolean) =>
        set({ enableCardsSorting }),
      setCardsStudyStarred: (cardsStudyStarred: boolean) =>
        set({ cardsStudyStarred }),
      setCardsAnswerWith: (cardsAnswerWith: LimitedStudySetAnswerMode) =>
        set({ cardsAnswerWith }),
      setMatchStudyStarred: (matchStudyStarred: boolean) =>
        set({ matchStudyStarred }),
      starTerm: (termId: string) => {
        set((state) => {
          return {
            starredTerms: [...state.starredTerms, termId],
          };
        });
      },
      unstarTerm: (termId: string) => {
        set((state) => {
          return {
            starredTerms: state.starredTerms.filter((id) => id !== termId),
          };
        });
      },
    })),
  );
};

export const ContainerContext = React.createContext<ContainerStore | null>(
  null,
);

export const useContainerContext = <T>(
  selector: (state: ContainerState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  const store = React.useContext(ContainerContext);
  if (!store) throw new Error("Missing ContainerContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
