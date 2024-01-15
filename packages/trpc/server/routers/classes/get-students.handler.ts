import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetStudentsSchema } from "./get-students.schema";

type GetStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TGetStudentsSchema;
};

export const getStudentsHandler = async ({
  ctx,
  input,
}: GetStudentsOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  const limit = input.limit ?? 50;
  const { cursor } = input;

  const users = await ctx.prisma.classMembership.findMany({
    where: input.query
      ? {
          classId: input.classId,
          type: "Student",
          deletedAt: null,
          sectionId: input.sectionId ?? undefined,
          user: {
            OR: [
              { username: { contains: input.query } },
              { name: { contains: input.query } },
              { email: { contains: input.query } },
            ],
          },
        }
      : {
          classId: input.classId,
          type: "Student",
          deletedAt: null,
          sectionId: input.sectionId ?? undefined,
        },
    take: limit + 1,
    cursor: cursor
      ? { email_classId: { email: cursor, classId: input.classId } }
      : undefined,
    select: {
      id: true,
      sectionId: true,
      email: true,
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
    orderBy: {
      email: "asc",
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (users.length > limit) {
    const nextItem = users.pop();
    nextCursor = nextItem!.email;
  }

  return {
    students: users,
    nextCursor,
  };
};

export default getStudentsHandler;
