import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Term } from "@prisma/client";
import { Question } from "../interfaces/question";
import { shuffleArray, takeNRandom } from "../utils/array";
import { RoundSummary } from "../interfaces/round-summary";
import { LearnTerm } from "../interfaces/learn-term";

export interface LearnStoreProps {
  terms: LearnTerm[];
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  answered?: string;
  status?: "correct" | "incorrect";
  roundSummary?: RoundSummary;
  prevTermWasIncorrect?: boolean;
}

interface LearnState extends LearnStoreProps {
  loadTerms: (terms: Term[]) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
  endQuestionCallback: (correct: boolean) => void;
  nextRound: () => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    terms: [],
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
        const learnTerms = terms.map((term) => ({ ...term, correctness: 0 }));
        const termsThisRound = learnTerms.slice(0, 7);

        const allChoices = Array.from(
          new Set(
            termsThisRound.concat(
              takeNRandom(learnTerms, Math.max(termsThisRound.length, 4))
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
          terms: learnTerms,
          numTerms: learnTerms.length,
          termsThisRound: termsThisRound.length,
          roundTimeline,
        });
      },
      answerCorrectly: (termId) => {
        set((state) => {
          return {
            answered: termId,
            status: "correct",
            prevTermWasIncorrect: false,
          };
        });

        setTimeout(() => {
          set((state) => {
            const active = state.roundTimeline[state.roundCounter]!;
            active.term.correctness = 1;

            state.endQuestionCallback(true);
            return {};
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
          prevTermWasIncorrect: true,
        }));
      },
      acknowledgeIncorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = -1;

          state.endQuestionCallback(false);
          return {};
        });
      },
      endQuestionCallback: (correct) => {
        set((state) => {
          if (state.roundProgress === state.termsThisRound - 1) {
            return {
              roundSummary: {
                round: state.currentRound,
                termsThisRound: Array.from(
                  new Set(state.roundTimeline.map((q) => q.term))
                ),
                progress: state.terms.filter((x) => x.correctness != 0).length,
                totalTerms: state.numTerms,
              },
              status: undefined,
            };
          }

          const roundCounter = state.roundCounter + 1;
          const roundProgress = state.roundProgress + (correct ? 1 : 0);

          return {
            roundCounter,
            roundProgress,
            answered: undefined,
            status: undefined,
          };
        });
      },
      nextRound: () => {
        set((state) => {
          const incorrectTerms = state.terms.filter((x) => x.correctness < 0);
          const unstudied = state.terms.filter((x) => x.correctness == 0);
          const termsThisRound = incorrectTerms.concat(unstudied).slice(0, 7);

          const allChoices = Array.from(
            new Set(
              termsThisRound.concat(
                takeNRandom(state.terms, Math.max(termsThisRound.length, 4))
              )
            )
          );

          const roundTimeline: Question[] = termsThisRound.map((term) => {
            const choices = shuffleArray(
              takeNRandom(
                allChoices.filter((choice) => choice.id !== term.id),
                Math.min(3, state.terms.length)
              ).concat(term)
            );

            return {
              choices,
              term,
              type: "choice",
            };
          });

          return {
            roundSummary: undefined,
            termsThisRound: termsThisRound.length,
            roundTimeline,
            roundCounter: 0,
            roundProgress: 0,
            answered: undefined,
            status: undefined,
            currentRound: state.currentRound + 1,
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
