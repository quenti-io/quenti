import type { StudySetAnswerMode } from "@quenti/prisma/client";

import type { CortexGraderResponse } from "./cortex";
import type { FacingTerm } from "./studiable-term";

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
  term: FacingTerm;
  distractor?: FacingTerm;
  answer?: boolean;
}

export interface MultipleChoiceData {
  term: FacingTerm;
  choices: FacingTerm[];
  answer?: string;
}

export interface WriteData {
  term: FacingTerm;
  evaluation?: boolean;
  cortexResponse?: CortexGraderResponse;
  answer?: string;
}

export interface MatchData {
  terms: FacingTerm[];
  zones: FacingTerm[];
  answer: { zone: string; term: string }[];
}
