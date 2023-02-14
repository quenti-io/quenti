import { Language } from "@prisma/client";

export const evaluate = (
  language: Language,
  input: string,
  answer: string
): boolean => {
  const caseSensitive = language == Language.Chemistry;

  input = input.trim();
  answer = answer.trim();
  if (caseSensitive) {
    return input == answer;
  }

  return input.toLowerCase() == answer.toLowerCase();
};
