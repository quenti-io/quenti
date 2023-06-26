import type { Term } from "@prisma/client";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { MATCH_SHUFFLE_TIME, MATCH_TERMS_IN_ROUND } from "../constants/match";
import { areRectanglesOverlapping, pad, type Rect } from "../utils/area";
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

const MATCH_SIDE_WALL_PADDING = 20;
const MATCH_MAX_OVERLAP_TRIES = 100;
const MATCH_TIMER_BOUNDS = { x: 300, y: 150 };

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
  setCard: (index: number, newTerm: MatchItem) => void;
  getIndicesUnder: (index: number, newInfo?: Partial<Rect>) => number[];
  validateUnderIndices: (index: number, wrapper: HTMLDivElement) => boolean;
  pickNewSpot: (
    index: number,
    term: MatchItem,
    elem: HTMLDivElement
  ) => { x: number; y: number };
}

interface MatchBehaviors {
  onRoundComplete: (roundSummary: RoundSummary) => void;
}

export const createMatchStore = (
  initProps?: Partial<MatchStoreProps>,
  behaviors?: Partial<MatchBehaviors>
) => {
  const DEFAULT_PROPS: MatchStoreProps = {
    roundStartTime: 0,
    termsThisRound: 0,
    roundProgress: 0,
    incorrectGuesses: 0,
    studiableTerms: [],
    roundQuestions: [],
    isEligableForLeaderboard: false,
    completed: true,
    terms: [],
  };

  return createStore<MatchState>()(
    subscribeWithSelector((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize(studiableTerms, isEligableForLeaderboard) {
        set({
          studiableTerms,
          termsThisRound: Math.min(studiableTerms.length, MATCH_TERMS_IN_ROUND),
          isEligableForLeaderboard: isEligableForLeaderboard,
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
        const state = get();
        if (state.roundProgress === state.termsThisRound - 1) {
          const summary = {
            endTime: Date.now(),
            termsThisRound: state.termsThisRound,
            incorrectGuesses: state.incorrectGuesses,
          };

          set({
            completed: true,
            roundSummary: summary,
          });

          behaviors?.onRoundComplete?.(summary);
        }
      },
      nextRound() {
        set((state) => ({
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
          terms: [],
        }));
      },
      setTerms(terms) {
        set({ terms });
      },
      setCard: (index: number, newTerm: MatchItem) => {
        set((state) => {
          return {
            terms: state.terms.map((term, i) => {
              if (i == index) return newTerm;
              return term;
            }),
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
      pickNewSpot: (index: number, term: MatchItem, elem: HTMLDivElement) => {
        let x = 0,
          y = 0;

        for (let i = 1; i < MATCH_MAX_OVERLAP_TRIES; i++) {
          x = pad(
            Math.random() * (elem.clientWidth - term.width),
            MATCH_SIDE_WALL_PADDING
          );
          y = Math.random() * (elem.clientHeight - term.height);

          // Avoid spawning on the timer
          if (x < MATCH_TIMER_BOUNDS.x && y < MATCH_TIMER_BOUNDS.y) continue;
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
        return { x, y };
      },
      validateUnderIndices: (index: number, elem: HTMLDivElement) => {
        const term = get().terms[index]!;
        const target = term.id;
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

          const { x, y } = get().pickNewSpot(index, term, elem);

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

        return correctIndex != undefined;
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
