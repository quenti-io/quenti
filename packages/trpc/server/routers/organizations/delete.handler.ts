import { cancelOrganizationSubscription } from "@quenti/payments";
import { TRPCError } from "@trpc/server";
import { disbandOrgUsers } from "../../lib/orgs/users";
import { isOrganizationOwner } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  if (!(await isOrganizationOwner(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  await cancelOrganizationSubscription(input.orgId);

  const deleted = await ctx.prisma.organization.delete({
    where: {
      id: input.orgId,
    },
  });

  if (deleted.published) {
    await disbandOrgUsers(deleted.id);
  }
};

export default deleteHandler;
