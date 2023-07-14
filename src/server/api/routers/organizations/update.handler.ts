import { TRPCError } from "@trpc/server";
import { isOrganizationAdmin } from "../../../../lib/server/queries/organizations";
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

  const existing = await ctx.prisma.organization.findUnique({
    where: {
      slug: input.slug,
    },
  });

  if (existing && existing.id !== input.id) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "slug_conflict",
    });
  }

  return await ctx.prisma.organization.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      slug: input.slug,
      icon: input.icon,
    },
  });
};

export default updateHandler;
