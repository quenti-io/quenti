import type { EntailmentResult } from "@quenti/interfaces";

import { Hf } from "../lib/huggingface";

export const bulkProcessEntailment = async (
  pairs: { answer: string; input: string }[],
): Promise<EntailmentResult[]> => {
  if (!Hf)
    return new Promise((resolve) =>
      resolve(Array(pairs.length).fill({ label: "neutral", score: 0 })),
    );

  return await Promise.all(
    pairs.map(({ answer, input }) => processEntailment(answer, input)),
  );
};

const processEntailment = async (
  answer: string,
  input: string,
): Promise<EntailmentResult> => {
  const sanitize = (text: string) =>
    text.trim().replace("[CLS]", "").replace("[SEP]", "");

  const results = await Hf!.request({
    // @ts-expect-error Argument of type
    inputs: `[CLS] ${sanitize(answer)} [SEP] ${sanitize(input)}`,
  });
  const sorted = (
    results as { label: EntailmentResult["label"]; score: number }[]
  ).sort((a, b) => b.score - a.score);

  const result = sorted[0];
  if (!result) return { label: "neutral", score: 0 };

  return result;
};
