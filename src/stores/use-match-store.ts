import type { Term } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { MATCH_TERMS_IN_ROUND } from "../server/api/common/constants";
import { takeNRandom } from "../utils/array";

interface RoundSummary {
  endTime: number;
  termsThisRound: number;
  incorrectGuesses: number;
}

export interface MatchStoreProps {
  roundStartTime: number;
  termsThisRound: number;
  roundProgress: number;
  incorrectGuesses: number;
  studiableTerms: Term[];
  roundQuestions: (Term & {
    completed: boolean;
  })[];
  isEligableForLeaderboard: boolean;
  completed: boolean;
  roundSummary?: RoundSummary;
  // For visuals. This isn't the best or anything but it works fine unless
  // someone picks up 2147483627 cards before finishing.
  zIndex: number;
}

interface MatchState extends MatchStoreProps {
  initialize: (
    studiableTerms: Term[],
    isEligableForLeaderboard: boolean
  ) => void;
  // Maybe this shouldn't use ids because it's pretty easy to cheat this way
  // But the code is open source and the easiest method of cheating
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  //checkAnswer: (termId: string) => void;
  answerCallback: (correct: boolean) => void;
  nextRound: () => void;
  requestZIndex: () => number;
}

export const createMatchStore = (initProps?: Partial<MatchStoreProps>) => {
  const DEFAULT_PROPS: MatchStoreProps = {
    roundStartTime: 0,
    termsThisRound: 0,
    roundProgress: 0,
    incorrectGuesses: 0,
    studiableTerms: [],
    roundQuestions: [],
    isEligableForLeaderboard: false,
    completed: true,
    zIndex: 0,
  };

  return createStore<MatchState>()(
    subscribeWithSelector((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize(studiableTerms, isEligableForLeaderboard) {
        set({
          studiableTerms,
          termsThisRound: MATCH_TERMS_IN_ROUND,
          isEligableForLeaderboard: isEligableForLeaderboard,
        });

        set((state) => {
          state.nextRound();
          return {};
        });
      },
      answerCorrectly(termId) {
        set((state) => {
          state.answerCallback(true);
          state.roundQuestions.find(
            (question) => question.id == termId
          )!.completed = true;
          return {
            roundProgress: state.roundProgress + 1,
            roundQuestions: state.roundQuestions,
          };
        });
      },
      answerIncorrectly(termId) {
        set((state) => {
          state.answerCallback(false);
          return {
            incorrectGuesses: state.incorrectGuesses + 1,
            roundQuestions: state.roundQuestions,
          };
        });
      },
      answerCallback(correct) {
        set((state) => {
          if (state.roundProgress === state.termsThisRound - 1) {
            return {
              completed: true,
              roundSummary: {
                endTime: Date.now(),
                termsThisRound: state.termsThisRound,
                incorrectGuesses: state.incorrectGuesses,
              },
            };
          }

          return {};
        });
      },
      nextRound() {
        set((state) => {
          return {
            roundStartTime: Date.now(),
            roundProgress: 0,
            incorrectGuesses: 0,
            roundQuestions: takeNRandom(
              state.studiableTerms,
              MATCH_TERMS_IN_ROUND
            ).map((term) => ({
              ...term,
              completed: false,
            })),
            completed: false,
            zIndex: 0,
            roundSummary: undefined,
          };
        });
      },
      requestZIndex() {
        set((state) => ({ zIndex: state.zIndex + 1 }));
        return get().zIndex;
      },
    }))
  );
};

export type MatchStore = ReturnType<typeof createMatchStore>;

export const MatchContext = React.createContext<MatchStore | null>(null);

export const useMatchContext = <T>(
  selector: (state: MatchState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = React.useContext(MatchContext);
  if (!store) throw new Error("Missing LearnContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
