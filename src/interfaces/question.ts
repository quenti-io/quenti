import type { StudySetAnswerMode, Term } from "@prisma/client";
import type { LearnTerm } from "./learn-term";

export interface Question {
  answerMode: StudySetAnswerMode;
  term: LearnTerm;
  type: "choice" | "write";
  choices: Term[];
}
