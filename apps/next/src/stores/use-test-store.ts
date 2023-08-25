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

export interface TestStoreProps {
  questionCount: number;
  questionTypes: TestQuestionType[];
  answerMode: StudySetAnswerMode;
  allTerms: Term[];
  outline: TestQuestionType[];
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
}

export type TestStore = ReturnType<typeof createTestStore>;

export const createTestStore = (initProps?: Partial<TestStoreProps>) => {
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
        outline = outline
          .concat(Array(5).fill(TestQuestionType.TrueFalse))
          .concat(Array(5).fill(TestQuestionType.MultipleChoice));

        const timeline: TestQuestion[] = [];

        for (const type of outline) {
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
              const terms = takeNRandom(pool, 4);
              pool = pool.filter((t) => !terms.find((x) => x.id == t.id));
              timeline.push(generateMatchQuestion(terms, answerMode));
            }
            case TestQuestionType.Write: {
              const term = pool.pop()!;
              timeline.push(generateWriteQuestion(term, answerMode));
            }
          }
        }

        console.log(timeline);

        set({
          allTerms,
          questionCount,
          questionTypes,
          answerMode,
          outline,
          timeline,
        });
      },
      answerQuestion: (index, data) => {
        set((state) => {
          const question = state.timeline[index]!;
          question.answered = true;
          question.data.answer = data;
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
    })),
  );
};

export const TestContext = React.createContext<TestStore | null>(null);

export const useTestContext = <T>(selector: (state: TestState) => T): T => {
  const store = React.useContext(TestContext);
  if (!store) throw new Error("Missing TestContext.Provider in the tree");

  return useStore(store, selector);
};
