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

    if (multipleAnswerMode == "All") {
      return input == answer
        ? EvaluationResult.Correct
        : EvaluationResult.Incorrect;
    } else if (multipleAnswerMode == "One") {
      // Get if answer array contains any of the input answers
      return inputAnswers.some((inputAnswer) =>
        answerAnswers.some((answerAnswer) => inputAnswer == answerAnswer)
      )
        ? EvaluationResult.Correct
        : EvaluationResult.Incorrect;
    }

    return EvaluationResult.UnknownPartial;
  };

  if (strictEquality) {
    return evaluateInner();
  }

  // Ignore text in parentheses
  input = input.replace(/\(.*?\)/g, "").trim();
  answer = answer.replace(/\(.*?\)/g, "").trim();

  return evaluateInner();
};

export const cleanSpaces = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};
