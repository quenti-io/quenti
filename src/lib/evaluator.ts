import { Language, type MultipleAnswerMode } from "@prisma/client";

export enum EvaluationResult {
  Correct,
  Incorrect,
  UnknownPartial,
}

export const evaluate = (
  language: Language,
  multipleAnswerMode: MultipleAnswerMode,
  input: string,
  answer: string
): EvaluationResult => {
  const strictEquality = language == Language.Chemistry;

  input = cleanSpaces(input.trim());
  answer = cleanSpaces(answer.trim());

  const evaluateInner = () => {
    const inputAnswers = input.split(/[,;\/]/).map((a) => a.trim());
    const answerAnswers = answer.split(/[,;\/]/).map((a) => a.trim());

    const fullEquality = answerAnswers.every((i) => inputAnswers.includes(i));
    const partialEquality = answerAnswers.some((i) => input.includes(i));

    console.log("inputAnswers", inputAnswers);
    console.log("answerAnswers", answerAnswers);
    console.log("fullEquality", fullEquality);
    console.log("partialEquality", partialEquality);

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
