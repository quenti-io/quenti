import type { Term } from "@quenti/prisma/client";

import { generateEmbeddings } from "../lib/embeddings";
import { VectorStore } from "../lib/vector-store";

type DistractorOutput = {
  type: "word" | "definition";
  termId: string;
  distractorId: string;
};

type Operatable = Pick<Term, "id" | "word" | "definition">;

export const bulkGenerateDistractors = async (
  terms: Operatable[],
): Promise<DistractorOutput[]> => {
  const wordDistractors = await generateDistractorsInScope(terms, "word");
  const definitionDistractors = await generateDistractorsInScope(
    terms,
    "definition",
  );

  return [...wordDistractors, ...definitionDistractors];
};

export const generateDistractorsInScope = async (
  terms: Operatable[],
  type: "word" | "definition",
) => {
  const output = new Array<DistractorOutput>();

  const embeddings = await generateEmbeddings(terms.map((t) => t[type]));
  const vectorStore = new VectorStore(embeddings);

  for (const [i, embedding] of embeddings.entries()) {
    const nearest = vectorStore.search(embedding);
    for (const n of nearest) {
      output.push({
        type,
        termId: terms[i]!.id,
        distractorId: terms[n]!.id,
      });
    }
  }

  return output;
};
