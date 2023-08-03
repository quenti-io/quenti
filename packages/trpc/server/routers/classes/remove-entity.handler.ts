import { TRPCError } from "@trpc/server";
import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveEntitySchema } from "./remove-entity.schema";

type RemoveEntityOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveEntitySchema;
};

export const removeEntityHandler = async ({
  ctx,
  input,
}: RemoveEntityOptions) => {
  const member = await getClassMember(input.classId, ctx.session.user.id);
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });

  if (input.type == "Folder") {
    await ctx.prisma.foldersOnClasses.delete({
      where: {
        folderId_classId: {
          folderId: input.entityId,
          classId: input.classId,
        },
      },
    });
  } else {
    await ctx.prisma.studySetsOnClasses.delete({
      where: {
        studySetId_classId: {
          studySetId: input.entityId,
          classId: input.classId,
        },
      },
    });
  }
};

export default removeEntityHandler;
