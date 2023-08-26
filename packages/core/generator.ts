import {
  type MatchData,
  type MultipleChoiceData,
  type TestQuestion,
  TestQuestionType,
  type TrueFalseData,
} from "@quenti/interfaces";
import { shuffleArray } from "@quenti/lib/array";
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
  distractorPool: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion<TrueFalseData> => {
  const evaluation = Math.random() > 0.5;
  const distractor = evaluation
    ? undefined
    : distractorPool[Math.floor(Math.random() * distractorPool.length)];

  return {
    type: TestQuestionType.TrueFalse,
    answerMode: getAnswerMode(answerMode),
    data: {
      term,
      distractor,
    },
    answered: false,
  };
};

export const generateMcqQuestion = (
  term: Term,
  distractorPool: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion<MultipleChoiceData> => {
  const distractors = generateDistractors(term, distractorPool, 3);
  const choices = shuffleArray([term, ...distractors]);

  return {
    type: TestQuestionType.MultipleChoice,
    answerMode: getAnswerMode(answerMode),
    data: {
      term,
      choices,
    },
    answered: false,
  };
};

export const generateMatchQuestion = (
  terms: Term[],
  answerMode: StudySetAnswerMode,
): TestQuestion<MatchData> => {
  return {
    type: TestQuestionType.Match,
    answerMode: getAnswerMode(answerMode),
    data: {
      terms,
      answer: [],
    },
    answered: false,
  };
};

export const generateWriteQuestion = (
  term: Term,
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  return {
    type: TestQuestionType.Write,
    answerMode: getAnswerMode(answerMode),
    data: { term },
    answered: false,
  };
};
