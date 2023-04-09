import type { Term } from "@prisma/client";

export type StudiableTerm = Term & {
  correctness: number;
  appearedInRound?: number | null;
  incorrectCount: number;
};
