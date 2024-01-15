import { strip } from "@quenti/lib/strip";
import { Prisma, type PrismaClient } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import {
  getClassMember,
  getClassOrganizationMember,
} from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

const memberSelect = Prisma.validator<Prisma.ClassMembershipDefaultArgs>()({
  select: {
    id: true,
    type: true,
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        image: true,
      },
    },
  },
});

const collabSelect = Prisma.validator<Prisma.StudySetCollabDefaultArgs>()({
  select: {
    id: true,
    type: true,
    minTermsPerUser: true,
    maxTermsPerUser: true,
    _count: {
      select: {
        topics: true,
      },
    },
  },
});

const studySetSelect = Prisma.validator<Prisma.StudySetDefaultArgs>()({
  select: {
    id: true,
    type: true,
    userId: true,
    createdAt: true,
    title: true,
    description: true,
    visibility: true,
    wordLanguage: true,
    definitionLanguage: true,
    collab: collabSelect,
    user: {
      select: {
        username: true,
        image: true,
      },
    },
    _count: {
      select: {
        terms: {
          where: {
            ephemeral: false,
          },
        },
        collaborators: true,
      },
    },
    collaborators: {
      take: 5,
      select: {
        user: {
          select: {
            image: true,
          },
        },
      },
    },
  },
});

const getTeacher = async (
  id: string,
  classId: string,
  prisma: PrismaClient,
) => {
  return await prisma.assignment.findUnique({
    where: {
      id_classId: {
        id,
        classId,
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      published: true,
      section: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              students: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      submissions: {
        distinct: ["memberId"],
        where: {
          submittedAt: { not: null },
          member: {
            deletedAt: null,
          },
        },
        select: {
          id: true,
          startedAt: true,
          submittedAt: true,
          member: memberSelect,
        },
      },
      studySet: studySetSelect,
    },
  });
};

const getStudent = async (
  id: string,
  classId: string,
  memberId: string,
  prisma: PrismaClient,
) => {
  return await prisma.assignment.findUnique({
    where: {
      id_classId: {
        id,
        classId,
      },
      AND: {
        availableAt: { lte: new Date() },
        published: true,
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      submissions: {
        where: {
          memberId,
        },
        orderBy: {
          startedAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          startedAt: true,
          submittedAt: true,
        },
      },
      studySet: studySetSelect,
    },
  });
};

type AwaitedGetTeacher = Awaited<ReturnType<typeof getTeacher>>;

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const member = await getClassMember(input.classId, ctx.session.user.id);
  let orgMember: Awaited<ReturnType<typeof getClassOrganizationMember>> = null;
  if (!member) {
    orgMember = await getClassOrganizationMember(input.id, ctx.session.user.id);
    if (!orgMember) throw new TRPCError({ code: "NOT_FOUND" });
  }

  const isTeacher =
    member?.type === "Teacher" ||
    ["Admin", "Owner"].includes(orgMember?.role || "");

  const assignment = (
    isTeacher
      ? await getTeacher(input.id, input.classId, ctx.prisma)
      : await getStudent(input.id, input.classId, member?.id || "", ctx.prisma)
  ) as AwaitedGetTeacher;

  if (!assignment) throw new TRPCError({ code: "NOT_FOUND" });

  const set = assignment.studySet;

  return {
    id: assignment.id,
    type: assignment.type,
    title: assignment.title,
    description: assignment.description,
    createdAt: assignment.createdAt,
    availableAt: assignment.availableAt,
    dueAt: assignment.dueAt,
    lockedAt: assignment.lockedAt,
    studySet: set
      ? {
          ...set,
          user: {
            username: set.user.username!,
            image: set.user.image!,
          },
          collaborators: {
            total: set._count.collaborators,
            avatars: set.collaborators.map((c) => c.user.image || ""),
          },
        }
      : null,
    ...strip({
      section: assignment.section,
      published: isTeacher ? assignment.published : undefined,
      submissions: isTeacher ? assignment.submissions : undefined,
      submission: !isTeacher ? assignment.submissions[0] : undefined,
    }),
  };
};

export default getHandler;
