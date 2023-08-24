import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  generateMatchQuestion,
  generateMcqQuestion,
  generateTrueFalseQuestion,
  generateWrittenQuestion,
} from "@quenti/core/generator";
import { type TestQuestion, TestQuestionType } from "@quenti/interfaces";
import { takeNRandom } from "@quenti/lib/array";
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
  answerQuestion: (index: number, entry: number, termId?: string) => void;
  clearAnswer: (index: number, entry: number) => void;
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
        const terms = takeNRandom(allTerms, questionCount);

        // An outline of what the test will look like before it is populated with questions
        let skeletonTimeline = new Array<{
          type: TestQuestionType;
          entries: number;
        }>();

        const order = Object.values(TestQuestionType) as TestQuestionType[];
        const priority = [
          TestQuestionType.MultipleChoice,
          TestQuestionType.Write,
          TestQuestionType.TrueFalse,
          TestQuestionType.Match,
        ];

        // Determines whether or not a question type is eligible to be added to the timeline
        // based on the number of spaces it has been calculated to consume
        const isEligibleGivenInstances = (
          type: TestQuestionType,
          count: number,
        ) => {
          if (type !== TestQuestionType.Match) return true;
          else return count >= 2;
        };

        // // The number of slots to be assigned for a particular question type
        // const getEntriesForType = (type: TestQuestionType, count: number) => {
        //   switch (type) {
        //     case TestQuestionType.TrueFalse:
        //     case TestQuestionType.MultipleChoice:
        //     case TestQuestionType.Write:
        //       return 1;
        //     case TestQuestionType.Match:
        //       return count;
        //   }
        // };

        // If the question count is divisible by the number of question
        // types, split the questions evenly.
        if (questionCount % questionTypes.length == 0) {
          for (const type of order) {
            const chunk = questionCount % questionTypes.length;
            if (isEligibleGivenInstances(type, chunk))
              skeletonTimeline.push({
                type,
                entries: chunk,
              });
          }
        } else {
          // Otherwise, split the questions as evenly as possible based on priority
          // and fill all of the remaining slots with the remaining question types
          // Example: if there 20 total questions, and three different types of questions,
          // the first 7 would be multiple choice, the next 7 would be true/false, and the last 6 is matching
          let remaining = questionCount;
          let remaininTypes = questionTypes.length;
          for (const type of priority.filter((x) =>
            questionTypes.includes(x),
          )) {
            const chunk = Math.ceil(remaining / remaininTypes);
            if (isEligibleGivenInstances(type, chunk))
              skeletonTimeline.push({
                type,
                entries: chunk,
              });

            remaining -= chunk;
            remaininTypes--;
          }

          // Sort the skeleton timeline by order
          skeletonTimeline = skeletonTimeline.sort(
            (a, b) => order.indexOf(a.type) - order.indexOf(b.type),
          );
        }

        const timeline = new Array<TestQuestion>();

        // Populate the timeline with questions
        for (const { type, entries } of skeletonTimeline) {
          switch (type) {
            case TestQuestionType.TrueFalse:
            case TestQuestionType.MultipleChoice:
            case TestQuestionType.Write:
              for (let i = 0; i < entries; i++) {
                timeline.push(
                  type == TestQuestionType.TrueFalse
                    ? generateTrueFalseQuestion(terms[i]!, allTerms, answerMode)
                    : type == TestQuestionType.MultipleChoice
                    ? generateMcqQuestion(terms[i]!, allTerms, answerMode)
                    : generateWrittenQuestion(terms[i]!, answerMode),
                );
              }
              break;
            case TestQuestionType.Match:
              const matchTerms = takeNRandom(allTerms, entries);
              timeline.push(generateMatchQuestion(matchTerms, answerMode));
              break;
          }
        }

        console.log("CREATED", timeline);

        set({
          allTerms,
          questionCount,
          questionTypes,
          answerMode,
          timeline,
          outline: timeline.map((q) => q.type),
        });
      },
      answerQuestion: (index, _entry, termId) => {
        set((state) => {
          const question = state.timeline[index]!;
          const entry = question.entries[_entry]!;

          entry.answer = {
            term: termId,
          };
          question.answered = true;

          return {
            timeline: state.timeline,
          };
        });
      },
      clearAnswer: (index, _entry) => {
        set((state) => {
          const question = state.timeline[index]!;
          const entry = question.entries[_entry]!;
          entry.answer = undefined;
          question.answered = false;

          return {
            timeline: state.timeline,
          };
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
