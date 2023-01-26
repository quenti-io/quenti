import {
  StarredTerm,
  StudySet,
  StudySetExperience,
  Term,
} from "@prisma/client";

export type SetData = StudySet & {
  terms: Term[];
  studySetExperiences: (StudySetExperience & {
    starredTerms: StarredTerm[];
  })[];
};
