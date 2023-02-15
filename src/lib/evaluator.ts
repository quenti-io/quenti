import { Language } from "@prisma/client";

export const evaluate = (
  language: Language,
  input: string,
  answer: string
): boolean => {
  const strictEquality = language == Language.Chemistry;

  input = cleanSpaces(input.trim());
  answer = cleanSpaces(answer.trim());
  if (strictEquality) {
    return input == answer;
  }

  // Ignore text in parentheses
  input = input.replace(/\(.*?\)/g, "").trim();
  answer = answer.replace(/\(.*?\)/g, "").trim();

  return input.toLowerCase() == answer.toLowerCase();
};

export const cleanSpaces = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};
