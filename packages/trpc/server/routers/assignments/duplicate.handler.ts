import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDuplicateSchema } from "./duplicate.schema";

type DuplicateOptions = {
  ctx: NonNullableUserContext;
  input: TDuplicateSchema;
};

export const duplicateHandler = async ({ ctx, input }: DuplicateOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  const assignment = await ctx.prisma.assignment.findUnique({
    where: {
      id_classId: {
        id: input.id,
        classId: input.classId,
      },
    },
    include: {
      studySet: {
        select: {
          type: true,
          title: true,
          description: true,
          wordLanguage: true,
          definitionLanguage: true,
          visibility: true,
          classesWithAccess: {
            select: {
              classId: true,
            },
          },
          terms: {
            where: {
              ephemeral: false,
              authorId: null,
            },
          },
          collab: {
            select: {
              type: true,
              minTermsPerUser: true,
              maxTermsPerUser: true,
            },
          },
        },
      },
    },
  });

  if (!assignment) throw new TRPCError({ code: "NOT_FOUND" });

  const sections = await ctx.prisma.section.findMany({
    where: {
      classId: input.classId,
      id: {
        not: assignment.sectionId,
        in: input.sectionIds,
      },
    },
    select: {
      id: true,
    },
  });

  await ctx.prisma.assignment.createMany({
    data: sections.map(({ id }) => ({
      ...assignment,
      id: undefined,
      templateId: assignment.id,
      description: assignment.description ?? undefined,
      sectionId: id,
      published: false,
      createdAt: undefined,
      updatedAt: undefined,
      studySet: undefined,
      studySetId: null,
    })),
  });

  if (!assignment.studySet) return;

  const createdAssignments = await ctx.prisma.assignment.findMany({
    where: {
      templateId: assignment.id,
    },
    select: {
      id: true,
    },
  });
  const createdIds = createdAssignments.map(({ id }) => id);

  // Create the study set containers first
  await ctx.prisma.studySet.createMany({
    data: createdIds.map((id) => ({
      ...assignment.studySet!,
      classesWithAccess: undefined,
      terms: undefined,
      collab: undefined,
      cortexStale: true,
      userId: ctx.session.user.id,
      assignmentId: id,
    })),
  });

  // Then set the visibility properly
  const studySets = await ctx.prisma.studySet.findMany({
    where: {
      assignmentId: {
        in: createdIds,
      },
    },
    select: {
      id: true,
    },
  });

  // Merge together all of the allowed classes
  const allowedClasses: { classId: string; studySetId: string }[] = [];
  for (const class_ of assignment.studySet.classesWithAccess) {
    for (const studySet of studySets) {
      allowedClasses.push({
        classId: class_.classId,
        studySetId: studySet.id,
      });
    }
  }

  await ctx.prisma.allowedClassesOnStudySets.createMany({
    data: allowedClasses,
  });

  const collab = assignment.studySet.collab;
  if (!collab) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  // Now create all of the collab objects
  await ctx.prisma.studySetCollab.createMany({
    data: studySets.map(({ id }) => ({
      ...collab,
      studySetId: id,
    })),
  });

  // Finally create the terms
  const existing = assignment.studySet.terms;
  if (!existing.length) return;

  const ranked = existing.sort((a, b) => a.rank - b.rank);
  const mapped = ranked.map((term, i) => ({ ...term, rank: i }));

  const terms = studySets
    .map(({ id }) =>
      mapped.map((t) => ({
        ...t,
        id: undefined,
        studySetId: id,
        wordRichText: t.wordRichText ?? undefined,
        definitionRichText: t.definitionRichText ?? undefined,
        ephemeral: false,
        authorId: null,
      })),
    )
    .flat();

  await ctx.prisma.term.createMany({
    data: terms,
  });
};

export default duplicateHandler;
