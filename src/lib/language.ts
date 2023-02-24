import json from "../../languages.json";
const languages = json.languages;
import type { StudySetAnswerMode } from "@prisma/client";

export type Language = keyof typeof languages;

const languageName = (l: Language) => languages[l];

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
