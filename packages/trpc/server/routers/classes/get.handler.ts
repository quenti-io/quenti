import { TRPCError } from "@trpc/server";
import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const member = await getClassMember(input.id, ctx.session.user.id);
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });

  const group = (await ctx.prisma.class.findUnique({
    where: {
      id: input.id,
    },
    include: {
      studySets: {
        include: {
          studySet: {
            select: {
              id: true,
              title: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  terms: true,
                },
              },
            },
          },
        },
      },
      folders: {
        include: {
          folder: {
            select: {
              id: true,
              title: true,
              slug: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  studySets: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          ...(member.type == "Teacher"
            ? {
                members: {
                  where: {
                    type: "Student",
                  },
                },
              }
            : {}),
        },
      },
    },
  }))!;

  return {
    name: group.name,
    description: group.description,
    orgId: group.orgId,
    studySets: group.studySets.map((s) => s.studySet),
    folders: group.folders.map((f) => f.folder),
    ...(group._count.members ? { students: group._count.members } : {}),
  };
};

export default getHandler;
