import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Term } from "@prisma/client";
import { LearnTerm } from "../interfaces/learn-term";
import { ActiveQuestion } from "../interfaces/active-question";
import { shuffleArray, takeNRandom } from "../utils/array";

export interface LearnStoreProps {
  unstudiedTerms: LearnTerm[];
  familiarTerms: LearnTerm[];
  masteredTerms: LearnTerm[];
  termsThisRound: LearnTerm[];
  repeatsThisRound: LearnTerm[];
  currentRound: number;
  roundCounter: number;
  active?: ActiveQuestion;
  answered?: string;
  status?: "correct" | "incorrect";
}

interface LearnState extends LearnStoreProps {
  loadTerms: (terms: Term[]) => void;
  familiarize: (termId: string) => void;
  master: (termId: string) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    unstudiedTerms: [],
    familiarTerms: [],
    masteredTerms: [],
    termsThisRound: [],
    repeatsThisRound: [],
    currentRound: 0,
    roundCounter: 0,
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      loadTerms: (terms) => {
        const learnTerms = terms.map((term) => ({
          ...term,
          failCount: 0,
        }));
        const termsThisRound = learnTerms.slice(0, 6);

        const term = termsThisRound[0]!;
        set({
          unstudiedTerms: learnTerms,
          termsThisRound: termsThisRound,
          active: {
            term,
            choices: shuffleArray([
              ...takeNRandom(
                termsThisRound.filter((x) => x.id != term.id),
                3
              ),
              term,
            ]),
            type: "choice",
          },
        });
      },
      familiarize: (termId) => {},
      master: (termId) => {},
      answerCorrectly: (termId) => {
        set((state) => {
          const isFamiliar = !!state.familiarTerms.find((x) => x.id == termId);

          return {
            answered: termId,
            status: "correct",
            familiarTerms: isFamiliar
              ? state.familiarTerms.filter((x) => x.id != termId)
              : [...state.familiarTerms, state.active!.term],
            masteredTerms: isFamiliar
              ? [...state.masteredTerms, state.active!.term]
              : state.masteredTerms,
          };
        });

        setTimeout(() => {
          set((state) => {
            const counter = state.roundCounter + 1;
            const term = state.termsThisRound[counter]!;

            return {
              answered: undefined,
              status: undefined,
              roundCounter: counter,
              active: {
                term,
                choices: shuffleArray([
                  ...takeNRandom(
                    state.termsThisRound.filter((x) => x.id != term.id),
                    3
                  ),
                  term,
                ]),
                type: "choice",
              },
            };
          });
        }, 1000);
      },
      answerIncorrectly: (termId) => {
        set((state) => ({
          answered: termId,
          status: "incorrect",
          repeatsThisRound: [...state.repeatsThisRound, state.active!.term],
        }));
      },
      acknowledgeIncorrect: () => {
        set((state) => {
          const counter = state.roundCounter + 1;
          const term = state.termsThisRound[counter]!;

          return {
            answered: undefined,
            status: undefined,
            roundCounter: counter,
            active: {
              term,
              choices: shuffleArray([
                ...takeNRandom(
                  state.termsThisRound.filter((x) => x.id != term.id),
                  3
                ),
                term,
              ]),
              type: "choice",
            },
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
