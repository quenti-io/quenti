import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { Language } from "@quenti/core";
import { EvaluationResult, evaluate } from "@quenti/core/evaluator";
import {
  generateMatchQuestion,
  generateMcqQuestion,
  generateTrueFalseQuestion,
  generateWriteQuestion,
} from "@quenti/core/generator";
import {
  type CortexGraderResponse,
  type DefaultData,
  type MatchData,
  type MultipleChoiceData,
  type TermWithDistractors,
  type TestQuestion,
  TestQuestionType,
  type TrueFalseData,
  type WriteData,
} from "@quenti/interfaces";
import { getRandom, shuffleArray, takeNRandom } from "@quenti/lib/array";
import { SPECIAL_CHAR_REGEXP } from "@quenti/lib/constants/characters";
import {
  CORRECT,
  CORRECT_IS_SIMILAR,
  INCORRECT,
  TRUE_FALSE_INCORRECT_IS_FALSE,
  TRUE_FALSE_INCORRECT_IS_TRUE,
} from "@quenti/lib/constants/remarks";
import type { StudySetAnswerMode } from "@quenti/prisma/client";

import { word } from "../utils/terms";

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
  wordLanguage: Language;
  definitionLanguage: Language;
  questionCount: number;
  questionTypes: TestQuestionType[];
  answerMode: StudySetAnswerMode;
  allTerms: TermWithDistractors[];
  starredTerms: string[];
  outline: OutlineEntry[];
  timeline: TestQuestion[];
  specialCharacters: string[];
  startedAt?: Date;
  endedAt?: Date;
  result?: {
    score: number;
    remarks: { id: string; remark: string }[][];
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
    allTerms: TermWithDistractors[],
    starredTerms: string[],
    questionCount: number,
    questionTypes: TestQuestionType[],
    studyStarred: boolean,
    answerMode: StudySetAnswerMode,
  ) => void;
  setSettings: (settings: Partial<TestStoreProps["settings"]>) => void;
  getMaxQuestions: () => number;
  answerQuestion: <D extends DefaultData>(
    index: number,
    data: D["answer"],
    completed?: boolean,
    ignoreDelegate?: boolean,
  ) => void;
  clearAnswer: (index: number) => void;
  setEndedAt: (date: Date) => void;
  submit: (
    cortexGraded: (CortexGraderResponse & { originalIndex: number })[],
  ) => void;
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
  wordLanguage: "en",
  definitionLanguage: "en",
  questionCount: 20,
  questionTypes: [
    TestQuestionType.TrueFalse,
    TestQuestionType.MultipleChoice,
    TestQuestionType.Match,
  ],
  answerMode: "Word",
  allTerms: [],
  starredTerms: [],
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
      initialize: (
        allTerms,
        starredTerms,
        questionCount,
        questionTypes,
        studyStarred,
        answerMode,
      ) => {
        const all = Array.from(allTerms);

        let initialTerms = Array.from(all);
        if (studyStarred && starredTerms.length > 0)
          initialTerms = initialTerms.filter((t) =>
            starredTerms.includes(t.id),
          );

        const words =
          answerMode != "Both"
            ? initialTerms.map((x) => word(answerMode, x, "answer"))
            : initialTerms.map((x) => [x.word, x.definition]).flat();

        const specialCharacters = Array.from(
          new Set(
            words
              .map((word) =>
                [...word.matchAll(SPECIAL_CHAR_REGEXP)]
                  .map((x) => Array.from(x))
                  .flat(),
              )
              .flat()
              .map((x) => x.split(""))
              .flat(),
          ),
        );

        let pool = shuffleArray(initialTerms);

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
              timeline.push(
                generateTrueFalseQuestion(term, answerMode, allTerms),
              );
              break;
            }
            case TestQuestionType.MultipleChoice: {
              const term = pool.pop()!;
              timeline.push(generateMcqQuestion(term, answerMode, allTerms));
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
            studyStarred,
          },
          allTerms: all,
          starredTerms,
          questionCount,
          questionTypes,
          answerMode,
          outline: consolidated,
          timeline,
          specialCharacters,
          startedAt: new Date(),
          endedAt: undefined,
        });
      },
      setSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },
      getMaxQuestions: () => {
        const state = get();
        return state.settings.studyStarred
          ? state.starredTerms.length
          : state.allTerms.length;
      },
      answerQuestion: (
        index,
        data,
        completed = true,
        ignoreDelegate = false,
      ) => {
        set((state) => {
          const question = state.timeline[index]!;
          question.answered = completed;
          question.data.answer = data;

          if (completed && !ignoreDelegate)
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
      setEndedAt: (date) => {
        set({ endedAt: date });
      },
      submit: (cortexGraded) => {
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
        const remarks: { id: string; remark: string }[][] = [];

        const increment = (type: TestQuestionType) => {
          score++;
          byType.find((t) => t.type == type)!.score++;
        };
        const answerCorrectly = (index: number) => {
          byQuestion.find((q) => q.index == index)!.correct = true;
        };

        const pushRemark = (
          id: string,
          evaluation: boolean,
          customBank?: string[],
        ) => {
          remarks.push([
            {
              id,
              remark: getRandom(
                customBank ?? (evaluation ? CORRECT : INCORRECT),
              ),
            },
          ]);
        };

        for (const [index, question] of state.timeline.entries()) {
          switch (question.type) {
            case TestQuestionType.TrueFalse: {
              const data = question.data as TrueFalseData;
              if (data.answer == !data.distractor) {
                increment(question.type);
                answerCorrectly(index);
                pushRemark(data.term.id, true);
              } else
                pushRemark(
                  data.term.id,
                  false,
                  data.distractor
                    ? TRUE_FALSE_INCORRECT_IS_FALSE
                    : TRUE_FALSE_INCORRECT_IS_TRUE,
                );

              break;
            }
            case TestQuestionType.MultipleChoice: {
              const data = question.data as MultipleChoiceData;
              if (data.answer == data.term.id) {
                increment(question.type);
                answerCorrectly(index);
              }
              pushRemark(data.term.id, data.answer == data.term.id);

              break;
            }
            case TestQuestionType.Write: {
              const data = question.data as WriteData;

              const cortexResponse = cortexGraded.find(
                (g) => g.originalIndex == index,
              );

              const evaluation =
                cortexResponse?.evaluation ??
                evaluate(
                  question.answerMode == "Definition"
                    ? state.definitionLanguage
                    : state.wordLanguage,
                  "One",
                  data.answer || "",
                  question.answerMode == "Definition"
                    ? data.term.definition
                    : data.term.word,
                ) == EvaluationResult.Correct;

              data.evaluation = evaluation;
              data.cortexResponse = cortexResponse;

              if (data.evaluation) {
                increment(question.type);
                answerCorrectly(index);

                if ((data.cortexResponse?.entailment?.score || 1) < 0.7) {
                  pushRemark(data.term.id, true, CORRECT_IS_SIMILAR);
                  break;
                }
              }

              pushRemark(data.term.id, data.evaluation);

              break;
            }
            case TestQuestionType.Match: {
              const data = question.data as MatchData;

              const matchRemarks = new Array<{ id: string; remark: string }>();
              // Start with the assumption that all answers are correct if everything is answered
              let allCorrect = data.answer.length == data.terms.length;
              for (const { term, zone } of data.answer) {
                if (term == zone) {
                  increment(question.type);
                  matchRemarks.push({ id: zone, remark: getRandom(CORRECT) });
                } else {
                  allCorrect = false;
                  matchRemarks.push({ id: zone, remark: getRandom(INCORRECT) });
                }
              }
              if (allCorrect) answerCorrectly(index);

              remarks.push(matchRemarks);

              break;
            }
          }
        }

        set({
          result: {
            score,
            byType,
            byQuestion,
            remarks,
          },
          timeline: [...state.timeline],
        });
      },
      reset: () => {
        set({
          result: undefined,
          outline: Array.from([]),
          timeline: Array.from([]),
        });

        const state = get();
        state.initialize(
          state.allTerms,
          state.starredTerms,
          state.settings.questionCount,
          state.settings.questionTypes,
          state.settings.studyStarred,
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
