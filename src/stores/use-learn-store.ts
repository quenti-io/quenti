import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Term } from "@prisma/client";

export interface LearnStoreProps {
  chunks: Term[][];
  currentRound: number;
  activeTerm: Term;
  activeQuestionType: "choice" | "write";
  choices: Term[];
}

interface LearnState extends LearnStoreProps {
  setChunks: (chunks: Term[][]) => void;
  setCurrentRound: (round: number) => void;
  setActiveTerm: (term: Term) => void;
  setActiveQuestionType: (type: "choice" | "write") => void;
  setChoices: (choices: Term[]) => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    chunks: [],
    currentRound: 0,
    activeTerm: {
      id: "",
      word: "",
      definition: "",
      studySetId: "",
    },
    activeQuestionType: "choice",
    choices: [],
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      setChunks: (chunks: Term[][]) => {
        set((state) => {
          return {
            chunks,
          };
        });
      },
      setCurrentRound: (round: number) => {
        set((state) => {
          return {
            currentRound: round,
          };
        });
      },
      setActiveTerm: (term: Term) => {
        set((state) => {
          return {
            activeTerm: term,
          };
        });
      },
      setActiveQuestionType: (type: "choice" | "write") => {
        set((state) => {
          return {
            activeQuestionType: type,
          };
        });
      },
      setChoices: (choices: Term[]) => {
        set((state) => {
          return {
            choices,
          };
        });
      },
    }))
  );
};

export const LearnContext = React.createContext<LearnStore | null>(null);

export const useLearnContext = <T>(
  selector: (state: LearnState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = React.useContext(LearnContext);
  if (!store) throw new Error("Missing LearnContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
