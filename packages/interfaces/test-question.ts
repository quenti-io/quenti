import type { StudySetAnswerMode } from "@quenti/prisma/client";

import type { Term } from ".prisma/client";

export enum TestQuestionType {
  TrueFalse = "TrueFalse",
  MultipleChoice = "MultipleChoice",
  Write = "Write",
  Match = "Match",
}

export type DefaultData =
  | TrueFalseData
  | MultipleChoiceData
  | WriteData
  | MatchData;

export interface TestQuestion<D = DefaultData> {
  type: TestQuestionType;
  answerMode: StudySetAnswerMode;
  data: D;
  answered: boolean;
}

export interface TrueFalseData {
  term: Term;
  distractor?: Term;
  answer?: boolean;
}

export interface MultipleChoiceData {
  term: Term;
  choices: Term[];
  answer?: string;
}

export interface WriteData {
  term: Term;
  answer?: string;
}

export interface MatchData {
  terms: Term[];
  answer: { zone: string; term: string }[];
}
