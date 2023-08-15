import type { MultipleAnswerMode } from "@quenti/prisma/client";

import type { Language } from "./language";

export enum EvaluationResult {
  Correct,
  Incorrect,
  UnknownPartial,
}

/**
 * Evaluates whether the input is correct, incorrect, or in a partially correct unknown state, based on the term language and multiple answer mode.
 * @param language The language of the term/definition, determines the use of strict equality
 * @param multipleAnswerMode How to handle multiple answers
 * @param input The user input
 * @param answer The expected answer
 * @returns The result of the evaluation
 */
export const evaluate = (
  language: Language,
  multipleAnswerMode: MultipleAnswerMode,
  input: string,
  answer: string,
): EvaluationResult => {
  const strictEquality = language == "chem" || language == "math";

  input = cleanSpaces(input.trim());
  answer = cleanSpaces(answer.trim());

  /**
   * Evaluates whether the input is equal to the answer, ignoring differences in whitespace between words.
   * @param i The user input
   * @param a The expected answer
   * @returns Whether the input is equal to the answer
   */
  const answerEvaluator = (i: string, a: string): boolean => {
    // Break both into words and compare each word individually
    const inputWords = i
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length);
    const answerWords = a
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length);

    if (inputWords.length != answerWords.length) return false;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] != answerWords[i]) return false;
    }

    return true;
  };

  /**
   * Evaluates whether the input is correct, incorrect, or partially correct based on
   * the separation of the term/definition based on commas, semicolons, and slashes.
   * @returns The result of the evaluation
   */
  const evaluateInner = (): EvaluationResult => {
    const inputAnswers = input.split(/[,;\/]/).map((a) => a.trim());
    const answerAnswers = answer.split(/[,;\/]/).map((a) => a.trim());

    const fullEquality = answerAnswers.every(
      (a) => !!inputAnswers.find((i) => answerEvaluator(i, a)),
    );
    const partialEquality = answerAnswers.some(
      (a) => !!inputAnswers.find((i) => answerEvaluator(i, a)),
    );

    if (fullEquality) return EvaluationResult.Correct;
    if (multipleAnswerMode == "Unknown" && partialEquality)
      return EvaluationResult.UnknownPartial;
    if (multipleAnswerMode == "One" && partialEquality)
      return EvaluationResult.Correct;

    return EvaluationResult.Incorrect;
  };

  if (strictEquality) {
    return evaluateInner();
  }

  // Ignore text in parentheses
  input = input
    .replace(/\(.*?\)/g, "")
    .trim()
    .toLowerCase();
  answer = answer
    .replace(/\(.*?\)/g, "")
    .trim()
    .toLowerCase();

  return evaluateInner();
};

export const cleanSpaces = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};
