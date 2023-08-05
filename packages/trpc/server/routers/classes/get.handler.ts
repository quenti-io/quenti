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

  const class_ = (await ctx.prisma.class.findUnique({
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
              visibility: true,
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
      ...(member.type == "Teacher"
        ? {
            sections: {
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
          }
        : undefined),
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
    id: class_.id,
    name: class_.name,
    description: class_.description,
    orgId: class_.orgId,
    studySets: class_.studySets.map((s) => s.studySet),
    folders: class_.folders.map((f) => f.folder),
    ...(member.type == "Teacher"
      ? {
          students: class_._count.members,
          sections: class_.sections!.map((s) => ({
            ...s,
            // @ts-expect-error property _count does not exist on type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            students: s._count.students as number,
          })),
        }
      : {}),
    me: {
      type: member.type,
      sectionId: member.sectionId,
    },
  };
};

export default getHandler;
