import { TRPCError } from "@trpc/server";
import { isOrganizationMember } from "../../../../lib/server/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TGetStudentsSchema } from "./get-students.schema";

type GetStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TGetStudentsSchema;
};

export const getStudentsHandler = async ({
  ctx,
  input,
}: GetStudentsOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await ctx.prisma.user.findMany({
    where: {
      organizationId: input.orgId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      image: true,
    },
  });
};

export default getStudentsHandler;
