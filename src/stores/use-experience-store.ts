import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ExperienceStoreProps {
  starredTerms: string[];
}

interface ExperienceState extends ExperienceStoreProps {
  starTerm: (termId: string) => void;
  unstarTerm: (termId: string) => void;
}

export type ExperienceStore = ReturnType<typeof createExperienceStore>;

export const createExperienceStore = (
  initProps?: Partial<ExperienceStoreProps>
) => {
  const DEFAULT_PROPS: ExperienceStoreProps = {
    starredTerms: [],
  };

  return createStore<ExperienceState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
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
