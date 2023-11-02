import type { Term } from "@quenti/prisma/client";

export type Distractor = {
  id: string;
  type: "Word" | "Definition";
  word: string;
  definition: string;
};

export type TermWithDistractors = Term & {
  distractors: Distractor[];
};
