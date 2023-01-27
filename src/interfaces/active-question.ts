import { Term } from "@prisma/client";
import { LearnTerm } from "./learn-term";

export interface ActiveQuestion {
  term: LearnTerm;
  type: "choice";
  choices: Term[];
}
