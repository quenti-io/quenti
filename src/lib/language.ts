import json from "../../languages.json";
const languages = json.languages;
const suggestions = json.suggestions;
import type { StudySetAnswerMode } from "@prisma/client";

export type Language = keyof typeof languages;

interface Suggestions {
  [key: string]: string;
}

export const languageName = (l: Language) => languages[l];
export const getSuggestions = (l: Language) =>
  ((suggestions as Suggestions)[l] || "").split("");

export const placeholderLanguage = (
  wordLanguage: Language,
  definitionLanguage: Language,
  answerMode: StudySetAnswerMode
) => {
  if (wordLanguage == definitionLanguage) return "answer";
  const language =
    answerMode == "Definition" ? definitionLanguage : wordLanguage;
  return language !== "en" ? languageName(language) : "answer";
};
