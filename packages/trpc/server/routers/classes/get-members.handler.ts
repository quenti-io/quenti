import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetMembersSchema } from "./get-members.schema";

type GetMembersOptions = {
  ctx: NonNullableUserContext;
  input: TGetMembersSchema;
};

export const getMembersHandler = async ({ ctx, input }: GetMembersOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  const class_ = await ctx.prisma.class.findUniqueOrThrow({
    where: {
      id: input.classId,
    },
    include: {
      members: {
        select: {
          id: true,
          sectionId: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
      teacherInvites: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    members: class_.members,
    invites: class_.teacherInvites,
  };
};

export default getMembersHandler;
