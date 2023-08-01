import type { StudySetAnswerMode, Term } from "@quenti/prisma/client";
import type { StudiableTerm } from "./studiable-term";

export interface Question {
  answerMode: StudySetAnswerMode;
  term: StudiableTerm;
  type: "choice" | "write";
  choices: Term[];
}
