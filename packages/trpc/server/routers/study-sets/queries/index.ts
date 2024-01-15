import { strip } from "@quenti/lib/strip";
import { prisma } from "@quenti/prisma";
import type { ClassMembershipType } from "@quenti/prisma/client";

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

// Weird Prisma type issues
type AssignmentTypeExtension = {
  assignment: {
    class: {
      members: {
        id: string;
        type: ClassMembershipType;
      }[];
    };
    submissions: {
      startedAt: Date;
      submittedAt?: Date;
    }[];
  };
};

export const getWithCollab = async (id: string, userId?: string) => {
  const set = await prisma.studySet.findUnique({
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

  if (!set) return null;
  const added = set as typeof set & AssignmentTypeExtension;

  return {
    ...added,
    assignment: added.assignment
      ? strip({
          ...added.assignment,
          me: added.assignment?.class.members[0],
        })
      : undefined,
  };
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
> &
  AssignmentTypeExtension;
export type AwaitedGetWithDistractors = NonNullable<
  Awaited<ReturnType<typeof getWithDistractors>>
>;

export type Collaborator = NonNullable<
  AwaitedGetWithCollab["collaborators"]
>[number] & {
  createdAt: Date;
};
