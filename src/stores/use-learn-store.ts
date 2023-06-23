import type { LearnMode, StudySetAnswerMode, Term } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { SPECIAL_CHAR_REGEXP } from "../constants/characters";
import { CORRECT, INCORRECT } from "../constants/remarks";
import type { Question } from "../interfaces/question";
import type { RoundSummary } from "../interfaces/round-summary";
import type { StudiableTerm } from "../interfaces/studiable-term";
import { LEARN_TERMS_IN_ROUND } from "../constants/learn";
import { shuffleArray, takeNRandom } from "../utils/array";

export interface LearnStoreProps {
  mode: LearnMode;
  answerMode: StudySetAnswerMode;
  studiableTerms: StudiableTerm[];
  allTerms: Term[];
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  specialCharacters: string[];
  feedbackBank: { correct: string[]; incorrect: string[] };
  answered?: string;
  status?: "correct" | "incorrect" | "unknownPartial";
  roundSummary?: RoundSummary;
  completed: boolean;
  prevTermWasIncorrect?: boolean;
}

interface LearnState extends LearnStoreProps {
  initialize: (
    mode: LearnMode,
    answerMode: StudySetAnswerMode,
    studiableTerms: StudiableTerm[],
    allTerms: Term[],
    round: number
  ) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
  answerUnknownPartial: () => void;
  overrideCorrect: () => void;
  endQuestionCallback: (correct: boolean) => void;
  correctFromUnknown: (termId: string) => void;
  incorrectFromUnknown: (termId: string) => void;
  nextRound: (start?: boolean) => void;
  setFeedbackBank: (correct: string[], incorrect: string[]) => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const word = (
  mode: StudySetAnswerMode,
  term: Term,
  type: "prompt" | "answer"
) => {
  if (mode == "Definition")
    return type == "prompt" ? term.word : term.definition;
  else return type == "prompt" ? term.definition : term.word;
};

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    mode: "Learn",
    answerMode: "Definition",
    studiableTerms: [],
    allTerms: [],
    numTerms: 0,
    termsThisRound: 0,
    currentRound: 0,
    roundProgress: 0,
    roundCounter: 0,
    roundTimeline: [],
    specialCharacters: [],
    feedbackBank: { correct: CORRECT, incorrect: INCORRECT },
    completed: false,
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (mode, answerMode, studiableTerms, allTerms, round) => {
        const specialCharacters = Array.from(
          new Set(
            studiableTerms
              .map((x) =>
                [...word(answerMode, x, "answer").matchAll(SPECIAL_CHAR_REGEXP)]
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
          answerMode,
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
      answerUnknownPartial: () => {
        set({ status: "unknownPartial" });
      },
      overrideCorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = 2;

          const roundTimeline = state.roundTimeline;
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
      correctFromUnknown: (termId) => {
        set({
          answered: termId,
          prevTermWasIncorrect: false,
        });

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = active.type == "choice" ? 1 : 2;

          state.endQuestionCallback(true);
          return {};
        });
      },
      incorrectFromUnknown: (termId) => {
        set((state) => ({
          answered: termId,
          roundTimeline:
            state.roundProgress != state.termsThisRound - 1
              ? [
                  ...state.roundTimeline,
                  state.roundTimeline[state.roundCounter]!,
                ]
              : state.roundTimeline,
          prevTermWasIncorrect: true,
        }));

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = -1;
          active.term.incorrectCount++;

          state.endQuestionCallback(false);
          return {};
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
            .slice(0, LEARN_TERMS_IN_ROUND);

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
            const answerMode: StudySetAnswerMode =
              state.answerMode != "Both"
                ? state.answerMode
                : Math.random() < 0.5
                ? "Definition"
                : "Word";

            if (choice) {
              const choices = shuffleArray(
                takeNRandom(
                  allChoices.filter((choice) => choice.id !== term.id),
                  Math.min(3, state.allTerms.length)
                ).concat(term)
              );

              return {
                answerMode,
                choices,
                term,
                type: "choice",
              };
            } else {
              return {
                answerMode,
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
      setFeedbackBank: (correct, incorrect) => {
        set({
          feedbackBank: { correct, incorrect },
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
