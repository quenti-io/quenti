import { type TestQuestion, TestQuestionType } from "@quenti/interfaces";
import type { StudySetAnswerMode, Term } from "@quenti/prisma/client";

import { generateDistractors } from "./distractors";

export const getAnswerMode = (
  answerMode: StudySetAnswerMode,
): StudySetAnswerMode => {
  if (answerMode == "Both") return Math.random() > 0.5 ? "Word" : "Definition";
  return answerMode;
};

export const generateTrueFalseQuestion = (
  term: Term,
  allTerms: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  const evaluation = Math.random() > 0.5;
  return {
    type: TestQuestionType.TrueFalse,
    answerMode: getAnswerMode(answerMode),
    entries: [
      {
        term,
        distractors: evaluation ? generateDistractors(term, allTerms, 1) : [],
      },
    ],
    answered: false,
  };
};

export const generateMcqQuestion = (
  term: Term,
  allTerms: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  return {
    type: TestQuestionType.MultipleChoice,
    answerMode: getAnswerMode(answerMode),
    entries: [
      {
        term,
        distractors: generateDistractors(term, allTerms, 3),
      },
    ],
    answered: false,
  };
};

export const generateMatchQuestion = (
  terms: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  return {
    type: TestQuestionType.Match,
    answerMode: getAnswerMode(answerMode),
    entries: terms.map((term) => ({ term, distractors: [] })),
    answered: false,
  };
};

export const generateWrittenQuestion = (
  term: Term,
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  return {
    type: TestQuestionType.Write,
    answerMode: getAnswerMode(answerMode),
    entries: [
      {
        term,
        distractors: [],
      },
    ],
    answered: false,
  };
};
