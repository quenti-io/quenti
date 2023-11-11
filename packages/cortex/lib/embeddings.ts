import { env } from "@quenti/env/server";
import { chunkArray } from "@quenti/lib/array";

import { cohere } from "./cohere";

const EMBEDDING_API_BATCH_SIZE = 96;

export const generateEmbeddings = async (
  terms: string[],
): Promise<number[][]> => {
  const batches = chunkArray(terms, EMBEDDING_API_BATCH_SIZE);
  return (
    await Promise.all(batches.map((batch) => generateEmbeddingsBatch(batch)))
  ).flat();
};

const generateEmbeddingsBatch = async (
  terms: string[],
): Promise<number[][]> => {
  const start = Date.now();

  if (!env.COHERE_API_KEY) return [];

  const response = await cohere.embed({
    model: "embed-multilingual-v2.0",
    texts: terms,
  });
  if (response.statusCode && response.statusCode !== 200) {
    throw new Error(
      "Cohere returned a status code of " + response.statusCode.toString(),
    );
  }

  const elapsed = Date.now() - start;

  return response.body.embeddings;
};
