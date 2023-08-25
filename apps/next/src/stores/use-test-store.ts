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
  type TestQuestion,
  TestQuestionType,
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
  ) => void;
  clearAnswer: (index: number) => void;
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
  };

  return createStore<TestState>()(
    subscribeWithSelector((set) => ({
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
      answerQuestion: (index, data) => {
        set((state) => {
          const question = state.timeline[index]!;
          question.answered = true;
          question.data.answer = data;

          behaviors?.onAnswerDelegate?.(index);
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
