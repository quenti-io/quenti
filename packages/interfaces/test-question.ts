import type { StudySetAnswerMode, Term } from "@quenti/prisma/client";

export type Distractor = {
  id: string;
  type: "Word" | "Definition";
  word: string;
  definition: string;
};
export type TermWithDistractors = Term & {
  distractors: Distractor[];
};

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
  distractor?: Distractor;
  answer?: boolean;
}

export interface MultipleChoiceData {
  term: Term;
  choices: Omit<Distractor, "type">[];
  answer?: string;
}

export interface WriteData {
  term: Term;
  evaluation?: boolean;
  cortexGraded?: boolean;
  answer?: string;
}

export interface MatchData {
  terms: Term[];
  zones: Term[];
  answer: { zone: string; term: string }[];
}
