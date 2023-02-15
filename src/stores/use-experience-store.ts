import type { MultipleAnswerMode, StudySetAnswerMode } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface ExperienceStoreProps {
  shuffleFlashcards: boolean;
  autoplayFlashcards: boolean;
  studyStarred: boolean;
  answerWith: StudySetAnswerMode;
  multipleAnswerMode: MultipleAnswerMode;
  extendedFeedbackBank: boolean;
  starredTerms: string[];
}

interface ExperienceState extends ExperienceStoreProps {
  toggleShuffleFlashcards: () => void;
  toggleAutoplayFlashcards: () => void;
  setStudyStarred: (studyStarred: boolean) => void;
  setAnswerWith: (answerWith: StudySetAnswerMode) => void;
  setMultipleAnswerMode: (multipleAnswerMode: MultipleAnswerMode) => void;
  setExtendedFeedbackBank: (extendedFeedbackBank: boolean) => void;
  starTerm: (termId: string) => void;
  unstarTerm: (termId: string) => void;
}

export type ExperienceStore = ReturnType<typeof createExperienceStore>;

export const createExperienceStore = (
  initProps?: Partial<ExperienceStoreProps>
) => {
  const DEFAULT_PROPS: ExperienceStoreProps = {
    shuffleFlashcards: false,
    autoplayFlashcards: false,
    studyStarred: false,
    answerWith: "Definition",
    extendedFeedbackBank: false,
    multipleAnswerMode: "Unknown",
    starredTerms: [],
  };

  return createStore<ExperienceState>()(
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
      setStudyStarred: (studyStarred: boolean) => {
        set({ studyStarred });
      },
      setAnswerWith: (answerWith: StudySetAnswerMode) => {
        set({ answerWith });
      },
      setMultipleAnswerMode: (multipleAnswerMode: MultipleAnswerMode) => {
        set({ multipleAnswerMode });
      },
      setExtendedFeedbackBank: (extendedFeedbackBank: boolean) => {
        set({ extendedFeedbackBank });
      },
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
    }))
  );
};

export const ExperienceContext = React.createContext<ExperienceStore | null>(
  null
);

export const useExperienceContext = <T>(
  selector: (state: ExperienceState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = React.useContext(ExperienceContext);
  if (!store) throw new Error("Missing ExperienceContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
