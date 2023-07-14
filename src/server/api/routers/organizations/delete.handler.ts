import { TRPCError } from "@trpc/server";
import { isOrganizationOwner } from "../../../../lib/server/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  if (!(await isOrganizationOwner(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  await ctx.prisma.organization.delete({
    where: {
      id: input.orgId,
    },
  });
};

export default deleteHandler;
