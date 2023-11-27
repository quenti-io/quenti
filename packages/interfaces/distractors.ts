import type { JSONContent } from "@tiptap/react";

import type { Term } from ".prisma/client";

export type Distractor = {
  id: string;
  type: "Word" | "Definition";
  word: string;
  definition: string;
  wordRichText?: JSONContent | null;
  definitionRichText?: JSONContent | null;
  assetUrl: string | null;
};

export type TermWithDistractors = Term & {
  distractors: Distractor[];
};
