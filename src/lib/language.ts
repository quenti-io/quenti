import type { Language, StudySetAnswerMode } from "@prisma/client";

export const placeholderLanguage = (
  wordLanguage: Language,
  definitionLanguage: Language,
  answerMode: StudySetAnswerMode
) => {
  if (wordLanguage == definitionLanguage) return "answer";
  const language =
    answerMode == "Definition" ? definitionLanguage : wordLanguage;
  return language !== "English" ? language : "answer";
};
