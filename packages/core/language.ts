import type { StudySetAnswerMode } from "@quenti/prisma/client";

import json from "./languages.json";

export const languages = json.languages;
export const suggestions = json.suggestions;

export type Language = keyof typeof languages;

export const LANGUAGE_VALUES: [string, ...string[]] = Object.keys(
  languages,
) as [Language, ...Language[]];

interface Suggestions {
  [key: string]: string;
}

export const languageName = (l: Language) => languages[l];
export const getSuggestions = (l: Language) =>
  ((suggestions as Suggestions)[l] || "").split("");

export const placeholderLanguage = (
  wordLanguage: Language,
  definitionLanguage: Language,
  answerMode: StudySetAnswerMode,
) => {
  if (wordLanguage == definitionLanguage) return "answer";
  const language =
    answerMode == "Definition" ? definitionLanguage : wordLanguage;
  return language !== "en" ? languageName(language) : "answer";
};
