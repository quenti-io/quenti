import type { DistractorType } from "@quenti/prisma/client";

import type { FacingTerm } from "./studiable-term";

export type Distractor = {
  type: DistractorType;
  termId: string;
  distractingId: string;
};

export type TermWithDistractors = FacingTerm & {
  distractors: Distractor[];
};
