import type { StudySetAnswerMode, Term } from "@quenti/prisma/client";

import type { CortexGraderResponse } from "./cortex";
import type { Distractor } from "./distractors";

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
  cortexResponse?: CortexGraderResponse;
  answer?: string;
}

export interface MatchData {
  terms: Term[];
  zones: Term[];
  answer: { zone: string; term: string }[];
}
