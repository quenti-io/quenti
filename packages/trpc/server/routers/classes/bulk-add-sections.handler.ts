import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkAddSectionsSchema } from "./bulk-add-sections.schema";

type BulkAddSectionsOptions = {
  ctx: NonNullableUserContext;
  input: TBulkAddSectionsSchema;
};

export const bulkAddSectionsHandler = async ({
  ctx,
  input,
}: BulkAddSectionsOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const sections = await ctx.prisma.section.findMany({
    where: {
      classId: input.classId,
    },
    select: {
      name: true,
    },
  });

  if (sections.length + input.sections.length >= 10)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You can only have up to 10 sections per class",
    });

  if (sections.map((s) => s.name).find((s) => input.sections.includes(s))) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "section_already_exists",
    });
  }

  await ctx.prisma.section.createMany({
    data: input.sections.map((section) => ({
      classId: input.classId,
      name: section,
    })),
  });
};

export default bulkAddSectionsHandler;
