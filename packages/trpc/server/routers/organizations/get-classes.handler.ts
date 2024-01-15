import { TRPCError } from "@trpc/server";

import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetClassesSchema } from "./get-classes.schema";

type GetClassesOptions = {
  ctx: NonNullableUserContext;
  input: TGetClassesSchema;
};

export const getClassesHandler = async ({ ctx, input }: GetClassesOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await ctx.prisma.class.findMany({
    where: {
      orgId: input.orgId,
    },
    select: {
      id: true,
      name: true,
      logoHash: true,
      logoUrl: true,
      bannerColor: true,
      cortexCategory: true,
      cortexCourse: true,
      _count: {
        select: {
          members: {
            where: {
              type: "Student",
              deletedAt: null,
            },
          },
          sections: true,
        },
      },
    },
  });
};

export default getClassesHandler;
