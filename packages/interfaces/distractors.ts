import type { DistractorType, Term } from "@quenti/prisma/client";

export type Distractor = {
  type: DistractorType;
  termId: string;
  distractingId: string;
};

export type TermWithDistractors = Term & {
  distractors: Distractor[];
};
