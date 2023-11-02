import type { JSONContent } from "@tiptap/react";

import type { TermWithDistractors } from "@quenti/interfaces";
import type { Prisma, StudySetAnswerMode } from "@quenti/prisma/client";

export const word = (
  mode: StudySetAnswerMode,
  term: Pick<TermWithDistractors, "word" | "definition">,
  type: "prompt" | "answer",
) => {
  if (mode == "Definition")
    return type == "prompt" ? term.word : term.definition;
  else return type == "prompt" ? term.definition : term.word;
};

export const richWord = (
  mode: StudySetAnswerMode,
  term: Pick<TermWithDistractors, "word" | "definition"> & {
    wordRichText?: Prisma.JsonValue | JSONContent | null;
    definitionRichText?: Prisma.JsonValue | JSONContent | null;
  },
  type: "prompt" | "answer",
) => {
  if (mode == "Definition")
    return type == "prompt"
      ? { text: term.word, richText: term.wordRichText as JSONContent }
      : {
          text: term.definition,
          richText: term.definitionRichText as JSONContent,
        };
  else
    return type == "prompt"
      ? {
          text: term.definition,
          richText: term.definitionRichText as JSONContent,
        }
      : { text: term.word, richText: term.wordRichText as JSONContent };
};
