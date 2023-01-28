import type { Term } from "@prisma/client";

export interface RoundSummary {
  round: number;
  termsThisRound: Term[];
  progress: number;
  totalTerms: number;
}
