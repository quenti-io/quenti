import type { LearnMode, Term } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { SPECIAL_CHAR_REGEXP } from "../constants/characters";
import type { LearnTerm } from "../interfaces/learn-term";
import type { Question } from "../interfaces/question";
import type { RoundSummary } from "../interfaces/round-summary";
import { shuffleArray, takeNRandom } from "../utils/array";

export interface LearnStoreProps {
  mode: LearnMode;
  studiableTerms: LearnTerm[];
  allTerms: Term[];
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  specialCharacters: string[];
  answered?: string;
  status?: "correct" | "incorrect";
  roundSummary?: RoundSummary;
  completed: boolean;
  prevTermWasIncorrect?: boolean;
}

interface LearnState extends LearnStoreProps {
  initialize: (
    mode: LearnMode,
    studiableTerms: LearnTerm[],
    allTerms: Term[],
    round: number
  ) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
  overrideCorrect: () => void;
  endQuestionCallback: (correct: boolean) => void;
  nextRound: (start?: boolean) => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    mode: "Learn",
    studiableTerms: [],
    allTerms: [],
    numTerms: 0,
    termsThisRound: 0,
    currentRound: 0,
    roundProgress: 0,
    roundCounter: 0,
    roundTimeline: [],
    specialCharacters: [],
    completed: false,
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (mode, studiableTerms, allTerms, round) => {
        const specialCharacters = Array.from(
          new Set(
            studiableTerms
              .map((x) =>
                [...x.definition.matchAll(SPECIAL_CHAR_REGEXP)]
                  .map((x) => Array.from(x))
                  .flat()
              )
              .flat()
              .map((x) => x.split(""))
              .flat()
          )
        );

        set({
          mode,
          studiableTerms,
          allTerms,
          numTerms: studiableTerms.length,
          currentRound: round,
          specialCharacters,
        });

        set((state) => {
          state.nextRound(true);
          return {};
        });
      },
      answerCorrectly: (termId) => {
        set({
          answered: termId,
          status: "correct",
          prevTermWasIncorrect: false,
        });

        setTimeout(() => {
          set((state) => {
            const active = state.roundTimeline[state.roundCounter]!;
            active.term.correctness = active.type == "choice" ? 1 : 2;

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
          active.term.incorrectCount++;

          state.endQuestionCallback(false);
          return {};
        });
      },
      overrideCorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = 2;

          let roundTimeline = state.roundTimeline;
          if (state.roundProgress != state.termsThisRound - 1) {
            // Remove the added question from the timeline
            roundTimeline.splice(-1);
          }

          state.endQuestionCallback(true);
          return {
            roundTimeline,
            prevTermWasIncorrect: false,
          };
        });
      },
      endQuestionCallback: (correct) => {
        set((state) => {
          const masteredCount = state.studiableTerms.filter(
            (x) => x.correctness == 2
          ).length;
          if (masteredCount == state.numTerms) return { completed: true };

          if (state.roundProgress === state.termsThisRound - 1) {
            return {
              roundSummary: {
                round: state.currentRound,
                termsThisRound: Array.from(
                  new Set(state.roundTimeline.map((q) => q.term))
                ),
                progress: state.studiableTerms.filter((x) => x.correctness != 0)
                  .length,
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
      nextRound: (start = false) => {
        set((state) => {
          const currentRound = state.currentRound + (!start ? 1 : 0);

          const incorrectTerms = state.studiableTerms.filter(
            (x) => x.correctness == -1
          );
          const unstudied = state.studiableTerms.filter(
            (x) => x.correctness == 0
          );

          const familiarTerms = state.studiableTerms.filter(
            (x) => x.correctness == 1
          );
          const familiarTermsWithRound = familiarTerms.map((x) => {
            if (x.appearedInRound === undefined)
              throw new Error("No round information for familiar term!");
            return x;
          });

          const termsThisRound = incorrectTerms
            .concat(
              // Add the familiar terms that haven't been seen at least 2 rounds ago
              familiarTermsWithRound.filter(
                (x) => currentRound - x.appearedInRound! >= 2
              )
            )
            .concat(unstudied)
            .concat(familiarTerms) // Add the rest of the familar terms if there's nothing else left
            .slice(0, 7);

          // For each term that hasn't been seen (correctness == 0), set the round it appeared in as the current round
          termsThisRound.forEach((x) => {
            if (x.correctness == 0) x.appearedInRound = currentRound;
          });

          const allChoices: Term[] = Array.from(
            new Set(
              termsThisRound
                .map((t) => state.allTerms.find((x) => x.id === t.id)!)
                .concat(
                  takeNRandom(
                    state.allTerms,
                    Math.max(termsThisRound.length, 4)
                  )
                )
            )
          );

          const roundTimeline: Question[] = termsThisRound.map((term) => {
            const choice = term.correctness < 1;

            if (choice) {
              const choices = shuffleArray(
                takeNRandom(
                  allChoices.filter((choice) => choice.id !== term.id),
                  Math.min(3, state.allTerms.length)
                ).concat(term)
              );

              return {
                choices,
                term,
                type: "choice",
              };
            } else {
              return {
                choices: [],
                term,
                type: "write",
              };
            }
          });

          return {
            roundSummary: undefined,
            termsThisRound: termsThisRound.length,
            roundTimeline,
            roundCounter: 0,
            roundProgress: 0,
            answered: undefined,
            status: undefined,
            completed: !termsThisRound.length,
            currentRound,
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
