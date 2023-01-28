import type { Term } from "@prisma/client";

export type LearnTerm = Term & {
  correctness: number;
};
