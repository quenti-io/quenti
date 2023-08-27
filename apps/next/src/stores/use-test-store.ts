import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  generateMatchQuestion,
  generateMcqQuestion,
  generateTrueFalseQuestion,
  generateWriteQuestion,
} from "@quenti/core/generator";
import {
  type DefaultData,
  type MatchData,
  type MultipleChoiceData,
  type TestQuestion,
  TestQuestionType,
  type TrueFalseData,
} from "@quenti/interfaces";
import { shuffleArray, takeNRandom } from "@quenti/lib/array";
import type { StudySetAnswerMode, Term } from "@quenti/prisma/client";

export type OutlineEntry = {
  index: number;
  type: TestQuestionType;
  count: number;
};

export interface TestStoreProps {
  questionCount: number;
  questionTypes: TestQuestionType[];
  answerMode: StudySetAnswerMode;
  allTerms: Term[];
  outline: OutlineEntry[];
  timeline: TestQuestion[];
  specialCharacters: string[];
  result?: {
    score: number;
    byType: {
      type: TestQuestionType;
      score: number;
      total: number;
    }[];
  };
}

interface TestState extends TestStoreProps {
  initialize: (
    allTerms: Term[],
    questionCount: number,
    questionTypes: TestQuestionType[],
    answerMode: StudySetAnswerMode,
  ) => void;
  answerQuestion: <D extends DefaultData>(
    index: number,
    data: D["answer"],
    completed?: boolean,
  ) => void;
  clearAnswer: (index: number) => void;
  submit: () => void;
  onAnswerDelegate: (index: number) => void;
}

export type TestStore = ReturnType<typeof createTestStore>;

export const createTestStore = (
  initProps?: Partial<TestStoreProps>,
  behaviors?: Partial<TestState>,
) => {
  const DEFAULT_PROPS: TestStoreProps = {
    questionCount: 20,
    questionTypes: [
      TestQuestionType.TrueFalse,
      TestQuestionType.MultipleChoice,
      TestQuestionType.Match,
    ],
    answerMode: "Word",
    allTerms: [],
    outline: [],
    timeline: [],
    specialCharacters: [],
    result: {
      score: 18,
      byType: [
        {
          type: TestQuestionType.TrueFalse,
          score: 5,
          total: 6,
        },
        {
          type: TestQuestionType.MultipleChoice,
          score: 4,
          total: 6,
        },
        {
          type: TestQuestionType.Match,
          score: 4,
          total: 6,
        },
      ],
    },
  };

  return createStore<TestState>()(
    subscribeWithSelector((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (allTerms, questionCount, questionTypes, answerMode) => {
        let pool = shuffleArray(allTerms);

        let outline: TestQuestionType[] = [];

        const typeOrder = Object.values(TestQuestionType);
        const types = typeOrder.filter((t) => questionTypes.includes(t));

        // Split the questions as evenly as possible based on the question count
        if (questionCount % types.length == 0) {
          for (const type of types) {
            outline = outline.concat(
              Array(questionCount / types.length).fill(type),
            );
          }
        } else {
          const basePerType = Math.floor(questionCount / types.length);
          let remainder = questionCount % types.length;

          for (const type of types) {
            outline = outline.concat(Array(basePerType).fill(type));
          }

          // Insert the remaning questions as evenly as possible between types
          while (remainder > 0) {
            for (const type of types) {
              if (remainder == 0) break;
              const insertionPoint = outline.findLastIndex((t) => t == type);
              outline.splice(insertionPoint + 1, 0, type);
              remainder--;
            }
          }
        }

        // Now we need to consolidate the outline and group specific question types together
        let index = 0;
        const consolidated: OutlineEntry[] = [];

        for (const type of outline) {
          if (type !== TestQuestionType.Match) {
            consolidated.push({ index, type, count: 1 });
            index++;
          } else {
            const last = consolidated[consolidated.length - 1];
            // Match questions can have at most 10 terms
            if (last?.type == TestQuestionType.Match && last?.count < 10)
              last.count++;
            else consolidated.push({ index, type, count: 1 });

            index += last?.count ?? 1;
          }
        }

        const timeline: TestQuestion[] = [];

        for (const { type, count } of consolidated) {
          switch (type) {
            case TestQuestionType.TrueFalse: {
              const term = pool.pop()!;
              timeline.push(generateTrueFalseQuestion(term, pool, answerMode));
              break;
            }
            case TestQuestionType.MultipleChoice: {
              const term = pool.pop()!;
              timeline.push(generateMcqQuestion(term, pool, answerMode));
              break;
            }
            case TestQuestionType.Match: {
              const terms = takeNRandom(pool, count);
              pool = pool.filter((t) => !terms.find((x) => x.id == t.id));
              timeline.push(generateMatchQuestion(terms, answerMode));
              break;
            }
            case TestQuestionType.Write: {
              const term = pool.pop()!;
              timeline.push(generateWriteQuestion(term, answerMode));
              break;
            }
          }
        }

        set({
          allTerms,
          questionCount,
          questionTypes,
          answerMode,
          outline: consolidated,
          timeline,
        });
      },
      answerQuestion: (index, data, completed = true) => {
        set((state) => {
          const question = state.timeline[index]!;
          question.answered = completed;
          question.data.answer = data;

          if (completed) behaviors?.onAnswerDelegate?.(index);
          return { timeline: [...state.timeline] };
        });
      },
      clearAnswer: (index) => {
        set((state) => {
          const question = state.timeline[index]!;
          question.answered = false;
          question.data.answer = undefined;
          return { timeline: [...state.timeline] };
        });
      },
      submit: () => {
        const state = get();
        if (state.timeline.some((q) => !q.answered))
          throw new Error("Not all questions have been answered");

        let score = 0;
        const byType: NonNullable<TestStoreProps["result"]>["byType"] =
          state.questionTypes.map((t) => ({
            type: t,
            score: 0,
            total: state.timeline.filter((q) => q.type == t).length,
          }));

        const increment = (type: TestQuestionType) => {
          score++;
          byType.find((t) => t.type == type)!.score++;
        };

        for (const question of state.timeline) {
          switch (question.type) {
            case TestQuestionType.TrueFalse: {
              const data = question.data as TrueFalseData;
              const isTrue = !data.distractor;
              if (isTrue && data.answer) increment(question.type);
              break;
            }
            case TestQuestionType.MultipleChoice: {
              const data = question.data as MultipleChoiceData;
              if (data.answer == data.term.id) increment(question.type);
              break;
            }
            case TestQuestionType.Match: {
              const data = question.data as MatchData;
              for (const { term, zone } of data.answer) {
                if (term == zone) increment(question.type);
              }
              break;
            }
          }
        }

        console.log("Score:", score);

        set({
          result: {
            score,
            byType,
          },
        });
      },
      onAnswerDelegate: (index) => {
        behaviors?.onAnswerDelegate?.(index);
      },
    })),
  );
};

export const TestContext = React.createContext<TestStore | null>(null);

export const useTestContext = <T>(selector: (state: TestState) => T): T => {
  const store = React.useContext(TestContext);
  if (!store) throw new Error("Missing TestContext.Provider in the tree");

  return useStore(store, selector);
};
