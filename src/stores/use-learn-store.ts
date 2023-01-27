import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Term } from "@prisma/client";
import { Question } from "../interfaces/question";
import { shuffleArray, takeNRandom } from "../utils/array";

export interface LearnStoreProps {
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  answered?: string;
  status?: "correct" | "incorrect";
}

interface LearnState extends LearnStoreProps {
  loadTerms: (terms: Term[]) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    numTerms: 0,
    termsThisRound: 0,
    currentRound: 0,
    roundProgress: 0,
    roundCounter: 0,
    roundTimeline: [],
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      loadTerms: (terms) => {
        const learnTerms = terms.map((term) => ({ ...term, failCount: 0 }));
        const termsThisRound = learnTerms.slice(0, 7);

        const allChoices = Array.from(
          new Set(
            termsThisRound.concat(
              takeNRandom(learnTerms, termsThisRound.length)
            )
          )
        );

        const roundTimeline: Question[] = termsThisRound.map((term) => {
          const choices = shuffleArray(
            takeNRandom(
              allChoices.filter((choice) => choice.id !== term.id),
              Math.min(3, learnTerms.length)
            ).concat(term)
          );

          return {
            choices,
            term,
            type: "choice",
          };
        });

        set({
          numTerms: learnTerms.length,
          termsThisRound: termsThisRound.length,
          roundTimeline,
        });
      },
      answerCorrectly: (termId) => {
        set({
          answered: termId,
          status: "correct",
        });

        setTimeout(() => {
          set((state) => {
            return {
              roundCounter: state.roundCounter + 1,
              roundProgress: state.roundProgress + 1,
              answered: undefined,
              status: undefined,
            };
          });
        }, 1000);
      },
      answerIncorrectly: (termId) => {
        set((state) => ({
          answered: termId,
          status: "incorrect",
          roundTimeline:
            state.roundProgress != state.termsThisRound - 1
              ? [
                  ...state.roundTimeline,
                  state.roundTimeline[state.roundCounter]!,
                ]
              : state.roundTimeline,
        }));
      },
      acknowledgeIncorrect: () => {
        set((state) => {
          state.roundTimeline[state.roundCounter]!.term.failCount++;

          return {
            roundCounter: state.roundCounter + 1,
            answered: undefined,
            status: undefined,
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
