import { Term } from "@prisma/client";
import { LearnTerm } from "./learn-term";

export interface Question {
  term: LearnTerm;
  type: "choice";
  choices: Term[];
}
