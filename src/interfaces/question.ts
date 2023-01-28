import type { Term } from "@prisma/client";
import type { LearnTerm } from "./learn-term";

export interface Question {
  term: LearnTerm;
  type: "choice";
  choices: Term[];
}
