import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBanStudentsSchema } from "./ban-students.schema";

type BanStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TBanStudentsSchema;
};

export const banStudentsHandler = async ({
  ctx,
  input,
}: BanStudentsOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const members = await ctx.prisma.classMembership.findMany({
    where: {
      classId: input.classId,
      id: {
        in: input.users,
      },
    },
  });

  await ctx.prisma.classMembership.deleteMany({
    where: {
      id: {
        in: members.map((member) => member.id),
      },
    },
  });

  await ctx.prisma.classBan.createMany({
    data: members.map((m) => ({
      classId: input.classId,
      userId: m.userId,
      email: m.email,
    })),
  });
};

export default banStudentsHandler;
