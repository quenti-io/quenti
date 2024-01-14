import type { FacingTerm } from "@quenti/interfaces";
import {
  type MatchData,
  type MultipleChoiceData,
  type TermWithDistractors,
  type TestQuestion,
  TestQuestionType,
  type TrueFalseData,
} from "@quenti/interfaces";
import { getRandom, shuffleArray } from "@quenti/lib/array";
import type { StudySetAnswerMode } from "@quenti/prisma/client";

export const getAnswerMode = (
  answerMode: StudySetAnswerMode,
): StudySetAnswerMode => {
  if (answerMode == "Both") return Math.random() > 0.5 ? "Word" : "Definition";
  return answerMode;
};

export const generateTrueFalseQuestion = (
  term: TermWithDistractors,
  answerMode: StudySetAnswerMode,
  allTerms: FacingTerm[],
): TestQuestion<TrueFalseData> => {
  const evaluation = Math.random() > 0.5;
  const distractor = !evaluation
    ? getRandom(term.distractors.filter((d) => d.type == answerMode))
    : undefined;

  return {
    type: TestQuestionType.TrueFalse,
    answerMode: getAnswerMode(answerMode),
    data: {
      term,
      distractor: distractor
        ? allTerms.find((t) => t.id == distractor.distractingId)!
        : undefined,
    },
    answered: false,
  };
};

export const generateMcqQuestion = (
  term: TermWithDistractors,
  answerMode: StudySetAnswerMode,
  alTerms: FacingTerm[],
): TestQuestion<MultipleChoiceData> => {
  const mode = getAnswerMode(answerMode);

  const distractors = shuffleArray(
    term.distractors.filter((d) => d.type == mode),
  );
  const distractorTerms = distractors.map(
    (d) => alTerms.find((t) => t.id == d.distractingId)!,
  );

  const choices = shuffleArray([term, ...distractorTerms]);

  return {
    type: TestQuestionType.MultipleChoice,
    answerMode: mode,
    data: {
      term,
      choices,
    },
    answered: false,
  };
};

export const generateMatchQuestion = (
  terms: FacingTerm[],
  answerMode: StudySetAnswerMode,
): TestQuestion<MatchData> => {
  return {
    type: TestQuestionType.Match,
    answerMode: getAnswerMode(answerMode),
    data: {
      terms: shuffleArray(Array.from(terms)),
      zones: terms,
      answer: [],
    },
    answered: false,
  };
};

export const generateWriteQuestion = (
  term: FacingTerm,
  answerMode: StudySetAnswerMode,
): TestQuestion => {
  return {
    type: TestQuestionType.Write,
    answerMode: getAnswerMode(answerMode),
    data: { term, answer: "" },
    answered: false,
  };
};
