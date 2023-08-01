import type { Term } from "@quenti/prisma/client";

export type StudiableTerm = Term & {
  correctness: number;
  appearedInRound?: number | null;
  incorrectCount: number;
};
