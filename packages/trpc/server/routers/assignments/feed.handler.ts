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
        students: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
  },
});

const studentSubmissionsSelect = (memberId: string) =>
  Prisma.validator<Prisma.Assignment$submissionsArgs>()({
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
  });

const getTeacher = async (
  classId: string,
  sectionId: string | null,
  query: string | null,
  prisma: PrismaClient,
) => {
  return await prisma.assignment.findMany({
    where: {
      classId,
      ...(sectionId ? { sectionId } : {}),
      ...(query ? { title: { contains: query } } : {}),
    },
    select: {
      id: true,
      type: true,
      title: true,
      createdAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      published: true,
      section: sectionSelect,
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
        },
      },
    },
  });
};

const getStudent = async (
  classId: string,
  sectionId: string,
  memberId: string,
  query: string | null,
  prisma: PrismaClient,
) => {
  return await prisma.assignment.findMany({
    where: {
      classId,
      sectionId,
      published: true,
      availableAt: { lte: new Date() },
      ...(query ? { title: { contains: query } } : {}),
    },
    select: {
      id: true,
      type: true,
      title: true,
      createdAt: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      submissions: studentSubmissionsSelect(memberId),
    },
  });
};

type DateOptions = {
  createdAt: Date;
  availableAt: Date;
  dueAt: Date | null;
  lockedAt: Date | null;
};

type AwaitedGetTeacher = Awaited<ReturnType<typeof getTeacher>>[number];
type AwaitedGetStudent = Awaited<ReturnType<typeof getStudent>>[number];
type Widened = Widen<AwaitedGetTeacher | AwaitedGetStudent> & DateOptions;

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

  if (!isTeacher && input.sectionId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot specify section id",
    });
  }

  const assignments = (
    isTeacher
      ? await getTeacher(
          input.classId,
          input.sectionId ?? null,
          input.query ?? null,
          ctx.prisma,
        )
      : await getStudent(
          input.classId,
          member!.sectionId || "",
          member!.id || "",
          input.query ?? null,
          ctx.prisma,
        )
  ) as Widened[];

  const total = await ctx.prisma.assignment.count({
    where: {
      classId: input.classId,
      ...(isTeacher ? {} : { published: true }),
    },
  });

  return {
    role: (isTeacher ? "Teacher" : "Student") as "Teacher" | "Student",
    total,
    assignments: assignments.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      createdAt: a.createdAt,
      availableAt: a.availableAt,
      dueAt: a.dueAt,
      lockedAt: a.lockedAt,
      ...strip({
        section: a.section,
        published: isTeacher ? a.published : undefined,
        submissions: a.submissions.length,
        submission: a.submissions?.[0] as
          | { id: string; startedAt: Date; submittedAt: Date | null }
          | undefined,
      }),
    })),
  };
};

export default feedHandler;
