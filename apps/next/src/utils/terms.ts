import type { TermWithDistractors } from "@quenti/interfaces";
import type { StudySetAnswerMode } from "@quenti/prisma/client";

export const word = (
  mode: StudySetAnswerMode,
  term: Pick<TermWithDistractors, "word" | "definition">,
  type: "prompt" | "answer",
) => {
  if (mode == "Definition")
    return type == "prompt" ? term.word : term.definition;
  else return type == "prompt" ? term.definition : term.word;
};
