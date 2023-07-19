import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TConfirmCodeSchema } from "./confirm-code.schema";
import {} from "next-auth/core";

type ConfirmCodeOptions = {
  ctx: NonNullableUserContext;
  input: TConfirmCodeSchema;
};

export const confirmCodeHandler = async ({
  ctx,
  input,
}: ConfirmCodeOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  // TODO: Handle code confirmation here
  return await ctx.prisma.verifiedOrganizationDomain.update({
    where: {
      orgId: input.orgId,
    },
    data: {
      verifiedAt: new Date(),
    },
  });
};

export default confirmCodeHandler;
