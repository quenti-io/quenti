import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TUpdateSchema } from "./update.schema";

type UpdateOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  const org = await ctx.prisma.organization.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!org) throw new TRPCError({ code: "NOT_FOUND" });
  if (!(await isOrganizationAdmin(ctx.session.user.id, org.id)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await ctx.prisma.organization.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      icon: input.icon,
    },
  });
};

export default updateHandler;