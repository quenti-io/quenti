import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface ExperienceStoreProps {
  shuffleFlashcards: boolean;
  starredTerms: string[];
}

interface ExperienceState extends ExperienceStoreProps {
  toggleShuffleFlashcards: () => void;
  starTerm: (termId: string) => void;
  unstarTerm: (termId: string) => void;
}

export type ExperienceStore = ReturnType<typeof createExperienceStore>;

export const createExperienceStore = (
  initProps?: Partial<ExperienceStoreProps>
) => {
  const DEFAULT_PROPS: ExperienceStoreProps = {
    shuffleFlashcards: false,
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
