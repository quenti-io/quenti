import type { Term } from "@quenti/prisma/client";

export interface RoundSummary {
  round: number;
  termsThisRound: Term[];
  progress: number;
  totalTerms: number;
}
