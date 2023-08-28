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
  type: TestQuestionType;
  startingIndex: number;
  count: number;
};

export interface TestStoreProps {
  settings: {
    questionCount: number;
    questionTypes: TestQuestionType[];
    studyStarred: boolean;
    answerMode: StudySetAnswerMode;
  };
  questionCount: number;
  questionTypes: TestQuestionType[];
  answerMode: StudySetAnswerMode;
  allTerms: Term[];
  outline: OutlineEntry[];
  timeline: TestQuestion[];
  specialCharacters: string[];
  startedAt?: Date;
  endedAt?: Date;
  result?: {
    score: number;
    byType: {
      type: TestQuestionType;
      score: number;
      total: number;
    }[];
    byQuestion: {
      index: number;
      correct: boolean;
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
  setSettings: (settings: Partial<TestStoreProps["settings"]>) => void;
  answerQuestion: <D extends DefaultData>(
    index: number,
    data: D["answer"],
    completed?: boolean,
  ) => void;
  clearAnswer: (index: number) => void;
  setEndedAt: (date: Date) => void;
  submit: () => void;
  reset: () => void;
  onAnswerDelegate: (index: number) => void;
}

export type TestStore = ReturnType<typeof createTestStore>;

export const DEFAULT_PROPS: TestStoreProps = {
  settings: {
    questionCount: 20,
    questionTypes: [
      TestQuestionType.TrueFalse,
      TestQuestionType.MultipleChoice,
      TestQuestionType.Match,
    ],
    studyStarred: false,
    answerMode: "Word",
  },
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

export const createTestStore = (
  initProps?: Partial<TestStoreProps>,
  behaviors?: Partial<TestState>,
) => {
  return createStore<TestState>()(
    subscribeWithSelector((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (allTerms, questionCount, questionTypes, answerMode) => {
        let pool = shuffleArray(Array.from(allTerms));

        const typeOrder = Object.values(TestQuestionType);
        let types = typeOrder.filter((t) => questionTypes.includes(t));

        const generateOutline = (
          questionTypes: TestQuestionType[],
        ): TestQuestionType[] => {
          let outline: TestQuestionType[] = [];

          // Split the questions as evenly as possible based on the question count
          if (questionCount % questionTypes.length == 0) {
            for (const type of questionTypes) {
              outline = outline.concat(
                Array(questionCount / questionTypes.length).fill(type),
              );
            }
          } else {
            const basePerType = Math.floor(
              questionCount / questionTypes.length,
            );
            let remainder = questionCount % questionTypes.length;

            for (const type of questionTypes) {
              outline = outline.concat(Array(basePerType).fill(type));
            }

            // Insert the remaning questions as evenly as possible between types
            while (remainder > 0) {
              for (const type of questionTypes) {
                if (remainder == 0) break;
                const insertionPoint = outline.findLastIndex((t) => t == type);
                outline.splice(insertionPoint + 1, 0, type);
                remainder--;
              }
            }
          }

          return outline;
        };

        let outline = generateOutline(types);
        if (outline.filter((t) => t == TestQuestionType.Match).length < 2) {
          types = types.filter((t) => t != TestQuestionType.Match);
          outline = generateOutline(types);
        }

        // Now we need to consolidate the outline and group specific question types together
        const consolidated: OutlineEntry[] = [];

        for (const [i, type] of outline.entries()) {
          if (type !== TestQuestionType.Match) {
            consolidated.push({ type, startingIndex: i, count: 1 });
          } else {
            const last = consolidated[consolidated.length - 1];

            // Match questions can have at most 10 terms
            if (last?.type == TestQuestionType.Match && last?.count < 10)
              last.count++;
            else
              consolidated.push({
                type,
                startingIndex: last ? last.startingIndex + last.count : 0,
                count: 1,
              });
          }
        }

        // Now if there are match questions with less than 2 terms, we need to merge them with the previous question
        for (let i = consolidated.length - 1; i >= 0; i--) {
          const entry = consolidated[i]!;
          if (entry.type == TestQuestionType.Match && entry.count < 2) {
            consolidated[i - 1]!.count += entry.count;
            consolidated.splice(i, 1);
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
          settings: {
            questionCount,
            questionTypes,
            answerMode,
            studyStarred: false,
          },
          allTerms,
          questionCount,
          questionTypes,
          answerMode,
          outline: consolidated,
          timeline,
          startedAt: new Date(),
          endedAt: undefined,
        });
      },
      setSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
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
      setEndedAt: (date) => {
        set({ endedAt: date });
      },
      submit: () => {
        const state = get();

        const getNumberOfQuestions = (type: TestQuestionType) => {
          switch (type) {
            case TestQuestionType.Match: {
              const data = state.timeline
                .filter((q) => q.type == type)
                .map((q) => q.data as MatchData);
              return data.reduce((acc, cur) => acc + cur.terms.length, 0);
            }
            default:
              return state.timeline.filter((q) => q.type == type).length;
          }
        };

        let score = 0;
        const byType: NonNullable<TestStoreProps["result"]>["byType"] =
          state.questionTypes.map((t) => ({
            type: t,
            score: 0,
            total: getNumberOfQuestions(t),
          }));
        const byQuestion: NonNullable<TestStoreProps["result"]>["byQuestion"] =
          state.timeline.map((_, i) => ({
            index: i,
            correct: false,
          }));

        const increment = (type: TestQuestionType) => {
          score++;
          byType.find((t) => t.type == type)!.score++;
        };
        const answerCorrectly = (index: number) => {
          byQuestion.find((q) => q.index == index)!.correct = true;
        };

        for (const [index, question] of state.timeline.entries()) {
          switch (question.type) {
            case TestQuestionType.TrueFalse: {
              const data = question.data as TrueFalseData;
              if (data.answer == !data.distractor) {
                increment(question.type);
                answerCorrectly(index);
              }
              break;
            }
            case TestQuestionType.MultipleChoice: {
              const data = question.data as MultipleChoiceData;
              if (data.answer == data.term.id) {
                increment(question.type);
                answerCorrectly(index);
              }
              break;
            }
            case TestQuestionType.Match: {
              const data = question.data as MatchData;
              // Start with the assumption that all answers are correct if everything is answered
              let allCorrect = data.answer.length == data.terms.length;
              for (const { term, zone } of data.answer) {
                if (term == zone) increment(question.type);
                else {
                  allCorrect = false;
                }
              }
              if (allCorrect) answerCorrectly(index);

              break;
            }
          }
        }

        set({
          result: {
            score,
            byType,
            byQuestion,
          },
        });
      },
      reset: () => {
        set({
          result: undefined,
          outline: [],
          timeline: [],
        });

        const state = get();
        state.initialize(
          state.allTerms,
          state.settings.questionCount,
          state.settings.questionTypes,
          state.settings.answerMode,
        );
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
