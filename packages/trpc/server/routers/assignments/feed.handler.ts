import { strip } from "@quenti/lib/strip";
import type { Widen } from "@quenti/lib/widen";
import { Prisma, type PrismaClient } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import {
  getClassMember,
  getClassOrganizationMember,
} from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TFeedSchema } from "./feed.schema";

type FeedOptions = {
  ctx: NonNullableUserContext;
  input: TFeedSchema;
};

const sectionSelect = Prisma.validator<Prisma.SectionDefaultArgs>()({
  select: {
    id: true,
    name: true,
    _count: {
      select: {
        students: true,
      },
    },
  },
});

const studentSubmissionsSelect = (memberId: string) =>
  Prisma.validator<Prisma.Assignment$submissionsArgs>()({
    where: {
      memberId,
    },
    select: {
      id: true,
      startedAt: true,
      submittedAt: true,
    },
  });

const getTeacher = async (classId: string, prisma: PrismaClient) => {
  return await prisma.assignment.findMany({
    where: {
      classId,
    },
    select: {
      id: true,
      type: true,
      name: true,
      createdAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      published: true,
      section: sectionSelect,
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });
};

const getStudent = async (
  classId: string,
  sectionId: string,
  memberId: string,
  prisma: PrismaClient,
) => {
  return await prisma.assignment.findMany({
    where: {
      classId,
      sectionId,
      published: true,
    },
    select: {
      id: true,
      type: true,
      name: true,
      createdAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      submissions: studentSubmissionsSelect(memberId),
    },
  });
};

type AwaitedGetTeacher = Awaited<ReturnType<typeof getTeacher>>[number];
type AwaitedGetStudent = Awaited<ReturnType<typeof getStudent>>[number];
type Widened = Widen<AwaitedGetTeacher | AwaitedGetStudent>;

export const feedHandler = async ({ ctx, input }: FeedOptions) => {
  const member = await getClassMember(input.classId, ctx.session.user.id);
  let orgMember: Awaited<ReturnType<typeof getClassOrganizationMember>> = null;
  if (!member) {
    orgMember = await getClassOrganizationMember(
      input.classId,
      ctx.session.user.id,
    );
    if (!orgMember) throw new TRPCError({ code: "NOT_FOUND" });
  }

  const isTeacher = member?.type === "Teacher" || !!orgMember;

  const assignments = (
    isTeacher
      ? await getTeacher(input.classId, ctx.prisma)
      : await getStudent(
          input.classId,
          member!.sectionId || "",
          member!.id || "",
          ctx.prisma,
        )
  ) as Widened[];

  return {
    role: isTeacher ? "Teacher" : "Student",
    assignments: assignments.map((a) => ({
      id: a.id,
      type: a.type,
      name: a.name,
      createdAt: a.createdAt,
      availableAt: a.availableAt,
      dueAt: a.dueAt,
      lockedAt: a.lockedAt,
      ...strip({
        section: a.section,
        submissions: a._count?.submissions,
        submission: a.submissions?.[0],
      }),
    })),
  };
};

export default feedHandler;
