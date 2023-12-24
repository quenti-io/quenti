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
    type: true,
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
      name: true,
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
              students: true,
            },
          },
        },
      },
      submissions: {
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
        published: true,
      },
    },
    select: {
      id: true,
      type: true,
      name: true,
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

  return {
    id: assignment.id,
    type: assignment.type,
    name: assignment.name,
    description: assignment.description,
    createdAt: assignment.createdAt,
    availableAt: assignment.availableAt,
    dueAt: assignment.dueAt,
    lockedAt: assignment.lockedAt,
    studySet: assignment.studySet,
    ...strip({
      section: assignment.section,
      submissions: isTeacher ? assignment.submissions : undefined,
      submission: !isTeacher ? assignment.submissions[0] || {} : undefined,
    }),
  };
};

export default getHandler;
