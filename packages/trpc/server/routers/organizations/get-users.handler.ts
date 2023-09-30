import { TRPCError } from "@trpc/server";

import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetUsersSchema } from "./get-users.schema";

type GetStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TGetUsersSchema;
};

export const getStudentsHandler = async ({
  ctx,
  input,
}: GetStudentsOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const limit = input.limit ?? 50;
  const { cursor } = input;

  const users = await ctx.prisma.user.findMany({
    where: input.query
      ? {
          organizationId: input.orgId,
          type: input.type,
          OR: [
            { username: { contains: input.query } },
            { name: { contains: input.query } },
            { email: { contains: input.query } },
          ],
        }
      : {
          organizationId: input.orgId,
          type: input.type,
        },
    take: limit + 1,
    cursor: cursor ? { email: cursor } : undefined,
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      image: true,
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
    users,
    nextCursor,
  };
};

export default getStudentsHandler;
