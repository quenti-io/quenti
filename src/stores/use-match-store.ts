import type { Term } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  MATCH_SHUFFLE_TIME,
  MATCH_TERMS_IN_ROUND,
} from "../server/api/common/constants";
import { takeNRandom } from "../utils/array";
import type { Rect } from "../utils/match";
import { areRectanglesOverlapping } from "../utils/match";

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
  terms: MatchItem[];
}

export interface MatchItem {
  id: string;
  width: number;
  height: number;
  type: "word" | "definition";
  word: string;
  y: number;
  x: number;
  targetX: number;
  targetY: number;
  completed: boolean;
  state?: "correct" | "incorrect";
}

interface MatchState extends MatchStoreProps {
  initialize: (
    studiableTerms: Term[],
    isEligableForLeaderboard: boolean
  ) => void;
  // Maybe this shouldn't use ids because it's pretty easy to cheat this way
  // But the code is open source and the easiest method of cheating
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: () => void;
  answerCallback: () => void;
  nextRound: () => void;
  setTerms: (terms: MatchItem[]) => void;
  requestZIndex: () => number;
  setCard: (index: number, newTerm: MatchItem) => void;
  getIndicesUnder: (index: number, newInfo?: Partial<Rect>) => number[];
  validateUnderIndices: (index: number, wrapper: HTMLDivElement) => void;
  pickNewSpot: (
    index: number,
    elem: HTMLDivElement
  ) => { x: number; y: number };
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
    terms: [],
  };

  return createStore<MatchState>()(
    subscribeWithSelector((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize(studiableTerms, isEligableForLeaderboard) {
        set({
          studiableTerms,
          termsThisRound:
            studiableTerms.length > MATCH_TERMS_IN_ROUND
              ? MATCH_TERMS_IN_ROUND
              : studiableTerms.length,
          isEligableForLeaderboard: isEligableForLeaderboard,
        });

        set((state) => {
          state.nextRound();
          return {};
        });
      },
      answerCorrectly(termId) {
        set((state) => {
          state.answerCallback();
          state.roundQuestions.find(
            (question) => question.id == termId
          )!.completed = true;
          return {
            roundProgress: state.roundProgress + 1,
            roundQuestions: state.roundQuestions,
          };
        });
      },
      answerIncorrectly() {
        set((state) => {
          state.answerCallback();
          return {
            incorrectGuesses: state.incorrectGuesses + 1,
            roundQuestions: state.roundQuestions,
          };
        });
      },
      answerCallback() {
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
            roundStartTime: Date.now() + MATCH_SHUFFLE_TIME * 1000,
            roundProgress: 0,
            incorrectGuesses: 0,
            roundQuestions: takeNRandom(
              state.studiableTerms,
              state.termsThisRound
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
      setTerms(terms) {
        set({ terms });
      },
      requestZIndex() {
        set((state) => ({ zIndex: state.zIndex + 1 }));
        return get().zIndex;
      },
      setCard: (index: number, newTerm: MatchItem) => {
        set((state) => {
          const newTerms = [...state.terms];
          newTerms[index] = newTerm;
          return {
            terms: newTerms,
          };
        });
      },
      getIndicesUnder: (index: number, newInfo?: Partial<Rect>) => {
        const cur = get().terms[index]!;
        return get().terms.flatMap((term, i) => {
          if (i == index || term.completed) return [];
          if (newInfo) {
            if (areRectanglesOverlapping({ ...cur, ...newInfo }, term)) {
              return [i];
            }
          } else if (areRectanglesOverlapping(cur, term)) return [i];

          return [];
        });
      },
      pickNewSpot: (index: number, elem: HTMLDivElement) => {
        for (let i = 0; i < 99; i++) {
          const x = Math.random() * (elem.clientWidth - 250) + 25;
          const y = Math.random() * (elem.clientHeight - 100) + 20;

          // Avoid spawning on the timer
          if (x < 300 && y < 150) continue;
          if (get().getIndicesUnder(index, { x, y }).length == 0)
            return { x, y };
        }

        /**
         * Timeout after 100 tries on a card, just return some random place.
         * Statistically it's very unlikely for this to happen in most situations
         * where it doesn't need to, just given that it gets more likely over time
         * and the chances of 100 attempts being unlucky is rare
         * so like it happens 1/1 million or smth on most screens and then mobile screens
         * might need to deal with an uneeded overlap occationally, still better than it was before
         */
        const x = Math.random() * (elem.clientWidth - 450) + 225;
        const y = Math.random() * (elem.clientHeight - 200) + 100;
        return { x, y };
      },
      validateUnderIndices: (index: number, elem: HTMLDivElement) => {
        const target = get().terms[index]!.id;
        const targetType =
          get().terms[index]!.type == "word" ? "definition" : "word";

        const indexes = get().getIndicesUnder(index);
        let correctIndex: number | undefined;
        const incorrects: number[] = [];
        indexes.forEach((index) => {
          if (
            get().terms[index]!.id == target &&
            get().terms[index]!.type == targetType
          )
            correctIndex = index;
          else incorrects.push(index);
        });

        if (correctIndex != undefined) {
          get().setCard(index, {
            ...get().terms[index]!,
            state: "correct",
          });

          get().setCard(correctIndex, {
            ...get().terms[correctIndex]!,
            state: "correct",
          });

          get().answerCorrectly(get().terms[index]!.id);
        } else if (incorrects.length > 0) {
          [...incorrects, index].forEach((idx) => {
            get().setCard(idx, {
              ...get().terms[idx]!,
              state: "incorrect",
            });
          });

          const { x, y } = get().pickNewSpot(index, elem);

          get().setCard(index, {
            ...get().terms[index]!,
            x,
            y,
            targetX: x,
            targetY: y,
          });

          get().answerIncorrectly();
        }

        setTimeout(() => {
          set((state) => ({
            terms: state.terms.map((x) => ({
              ...x,
              completed: x.state == "correct",
              state: x.state != "correct" ? undefined : x.state,
            })),
          }));
        }, 500);
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
  if (!store) throw new Error("Missing MatchContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
