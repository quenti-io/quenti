import type { StudySetAnswerMode } from "@quenti/prisma/client";

import type { Term } from ".prisma/client";

export enum TestQuestionType {
  TrueFalse = "TrueFalse",
  MultipleChoice = "MultipleChoice",
  Write = "Write",
  Match = "Match",
}

export interface TestQuestion {
  type: TestQuestionType;
  answerMode: StudySetAnswerMode;
  entries: QuestionEntry[];
  answered: boolean;
}

export interface QuestionEntry {
  term: Term;
  distractors: Term[];
  answer?: AnswerObject;
}

export interface AnswerObject {
  term?: string;
}
