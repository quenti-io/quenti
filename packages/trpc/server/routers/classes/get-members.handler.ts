import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetMembersSchema } from "./get-members.schema";

type GetMembersOptions = {
  ctx: NonNullableUserContext;
  input: TGetMembersSchema;
};

export const getMembersHandler = async ({ ctx, input }: GetMembersOptions) => {
  const member = await ctx.prisma.classMembership.findUnique({
    where: {
      classId_userId: {
        classId: input.id,
        userId: ctx.session.user.id,
      },
    },
    include: {
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
  });

  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });

  const class_ = await ctx.prisma.class.findUniqueOrThrow({
    where: {
      id: input.id,
    },
    include: {
      members: {
        where: {
          type: "Teacher",
        },
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
      teacherInvites: {
        select: {
          id: true,
          email: true,
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
    me: member,
  };
};

export default getMembersHandler;
