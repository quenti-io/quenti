import cohere from "cohere-ai";

import { env } from "@quenti/env/server";

if (env.COHERE_API_KEY) cohere.init(env.COHERE_API_KEY);

export const generateEmbeddings = async (
  terms: string[],
): Promise<number[][]> => {
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

  return response.body.embeddings;
};
