import type { Term } from "@quenti/prisma/client";

import type { Distractor } from "./distractors";

export type StudiableTerm = Term & {
  correctness: number;
  appearedInRound?: number | null;
  incorrectCount: number;
};

export type StudiableTermWithDistractors = StudiableTerm & {
  distractors: Distractor[];
};
