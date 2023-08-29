import { similarity } from "ml-distance";

import { chunkArray } from "@quenti/lib/array";

import { generateEmbeddings } from "../lib/embeddings";

const SIMILARITY_THRESHOLD = 0.75;

export const bulkGradeAnswers = async (
  answers: { answer: string; input: string }[],
) => {
  const embeddings = await generateEmbeddings(
    answers.flatMap((a) => [a.answer, a.input]),
  );
  const pairs = chunkArray(embeddings, 2);

  const evaluations = new Array<boolean>();
  for (const pair of pairs) {
    const value = similarity.cosine(pair[0]!, pair[1]!);
    evaluations.push(value > SIMILARITY_THRESHOLD);
  }

  return evaluations;
};
