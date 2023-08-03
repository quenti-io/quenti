import { TRPCError } from "@trpc/server";
import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  if (!(await getClassMember(input.id, ctx.session.user.id)))
    throw new TRPCError({ code: "NOT_FOUND" });

  return await ctx.prisma.class.findUnique({
    where: {
      id: input.id,
    },
    include: {
      _count: {
        select: {
          members: true,
          studySets: true,
          folders: true,
        },
      },
    },
  });
};

export default getHandler;
