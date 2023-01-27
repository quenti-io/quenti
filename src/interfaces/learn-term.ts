import { Term } from "@prisma/client";

export type LearnTerm = Term & {
  failCount: number;
};
