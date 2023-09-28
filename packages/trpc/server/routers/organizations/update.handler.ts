import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUpdateSchema } from "./update.schema";

type UpdateOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.id)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await ctx.prisma.organization.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      ...(input.clearLogo
        ? {
            logoUrl: null,
            logoHash: null,
          }
        : {}),
    },
  });
};

export default updateHandler;
