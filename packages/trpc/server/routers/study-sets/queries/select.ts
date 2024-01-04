import { Prisma } from "@quenti/prisma/client";

export const studySetSelect = Prisma.validator<Prisma.StudySetSelect>()({
  id: true,
  userId: true,
  createdAt: true,
  savedAt: true,
  title: true,
  type: true,
  description: true,
  created: true,
  cortexStale: true,
  tags: true,
  visibility: true,
  wordLanguage: true,
  definitionLanguage: true,
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      displayName: true,
      image: true,
      verified: true,
    },
  },
});

export const termsSelect = Prisma.validator<Prisma.TermSelect>()({
  id: true,
  rank: true,
  word: true,
  definition: true,
  wordRichText: true,
  definitionRichText: true,
  assetUrl: true,
  studySetId: true,
});

export const distractorsArgs = Prisma.validator<Prisma.Term$distractorsArgs>()({
  select: {
    termId: true,
    distractingId: true,
    type: true,
  },
});
