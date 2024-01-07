import { prisma } from "@quenti/prisma";

import {
  assignmentArgs,
  collabSelect,
  collabTermsSelect,
  collaboratorsSelect,
} from "./collab";
import { distractorsArgs, studySetSelect, termsSelect } from "./select";

export * from "./collab";
export * from "./select";

export const get = async (id: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      terms: {
        where: {
          ephemeral: false,
        },
        select: termsSelect,
      },
    },
  });
};

export const getWithCollab = async (id: string, userId?: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      collaborators: {
        select: collaboratorsSelect,
      },
      collab: {
        select: collabSelect(userId),
      },
      assignment: userId ? assignmentArgs(userId) : false,
      terms: {
        where: {
          ephemeral: false,
        },
        select: {
          ...termsSelect,
          ...collabTermsSelect,
        },
      },
    },
  });
};

export const getWithDistractors = async (id: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      collaborators: {
        select: collaboratorsSelect,
      },
      terms: {
        where: {
          ephemeral: false,
        },
        select: {
          ...termsSelect,
          distractors: distractorsArgs,
        },
      },
    },
  });
};

export type AwaitedGet = NonNullable<Awaited<ReturnType<typeof get>>>;
export type AwaitedGetWithCollab = NonNullable<
  Awaited<ReturnType<typeof getWithCollab>>
> & {
  assignment: {
    submissions: {
      startedAt: Date;
      submittedAt?: Date;
    }[];
  };
};
export type AwaitedGetWithDistractors = NonNullable<
  Awaited<ReturnType<typeof getWithDistractors>>
>;

export type Collaborator = NonNullable<
  AwaitedGetWithCollab["collaborators"]
>[number] & {
  createdAt: Date;
};
