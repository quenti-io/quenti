import type { EntailmentResult } from "@quenti/interfaces";

import { Hf } from "../lib/huggingface";

export const bulkProcessEntailment = async (
  pairs: { answer: string; input: string }[],
): Promise<EntailmentResult[]> => {
  if (!Hf)
    return new Promise((resolve) =>
      resolve(Array(pairs.length).fill({ label: "NEUTRAL", score: 0 })),
    );

  return await Promise.all(
    pairs.map(({ answer, input }) => processEntailment(answer, input)),
  );
};

const processEntailment = async (
  answer: string,
  input: string,
): Promise<EntailmentResult> => {
  const terminate = (text: string) => (text.endsWith(".") ? text : text + ".");

  const results = await Hf!.request({
    // @ts-expect-error Argument of type
    inputs: `${terminate(answer)} ${terminate(input)}`,
  });
  const sorted = (
    results as { label: EntailmentResult["label"]; score: number }[]
  ).sort((a, b) => b.score - a.score);

  const result = sorted[0];
  if (!result) return { label: "NEUTRAL", score: 0 };

  return result;
};
