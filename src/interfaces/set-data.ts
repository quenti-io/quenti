import type { StudySetVisibility, Term } from "@prisma/client";

export type SetData = {
  experience: {
    starredTerms: string[];
    studiableTerms: {
      id: string;
      correctness: number;
      appearedInRound: number;
    }[];
    id: string;
    userId: string;
    studySetId: string;
    shuffleFlashcards: boolean;
    learnRound: number;
  };
  id: string;
  userId: string;
  user: {
    username: string;
    image: string;
    verified: boolean;
  };
  title: string;
  description: string;
  visibility: StudySetVisibility;
  terms: Term[];
};
