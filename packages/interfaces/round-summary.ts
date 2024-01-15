import type { FacingTerm } from "./studiable-term";

export interface RoundSummary {
  round: number;
  termsThisRound: FacingTerm[];
  progress: number;
  totalTerms: number;
}
