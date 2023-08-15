import { TRPCError } from "@trpc/server";

import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddEntitiesSchema } from "./add-entities.schema";

type AddEntitiesOptions = {
  ctx: NonNullableUserContext;
  input: TAddEntitiesSchema;
};

export const addEntitiesHandler = async ({
  ctx,
  input,
}: AddEntitiesOptions) => {
  const member = await getClassMember(input.classId, ctx.session.user.id);
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });

  const class_ = (await ctx.prisma.class.findUnique({
    where: {
      id: input.classId,
    },
    include: {
      studySets: {
        select: {
          studySetId: true,
        },
      },
      folders: {
        select: {
          folderId: true,
        },
      },
    },
  }))!;

  if (input.type == "Folder") {
    const folders = await ctx.prisma.folder.findMany({
      where: {
        id: {
          in: input.entities,
          notIn: class_.folders.map((x) => x.folderId),
        },
      },
      select: {
        id: true,
      },
    });

    await ctx.prisma.foldersOnClasses.createMany({
      data: folders.map((f) => ({
        classId: input.classId,
        folderId: f.id,
      })),
    });
  } else {
    const studySets = await ctx.prisma.studySet.findMany({
      where: {
        id: {
          in: input.entities,
          notIn: class_.studySets.map((x) => x.studySetId),
        },
      },
      select: {
        id: true,
        userId: true,
        visibility: true,
      },
    });

    if (
      studySets.find(
        (x) => x.visibility == "Private" && x.userId !== ctx.session.user.id,
      )
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot add other users' private study sets to a folder",
      });
    }

    await ctx.prisma.studySetsOnClasses.createMany({
      data: studySets.map((s) => ({
        classId: input.classId,
        studySetId: s.id,
      })),
    });
  }
};

export default addEntitiesHandler;
