import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteJoinCodeSchema } from "./delete-join-code.schema";

type DeleteJoinCodeOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteJoinCodeSchema;
};

export const deleteJoinCodeHandler = async ({
  ctx,
  input,
}: DeleteJoinCodeOptions) => {
  const joinCode = await ctx.prisma.classJoinCode.findFirst({
    where: {
      classId: input.classId,
      sectionId: input.sectionId,
    },
  });

  if (!joinCode) throw new TRPCError({ code: "NOT_FOUND" });

  await ctx.prisma.classJoinCode.delete({
    where: {
      id: joinCode.id,
    },
  });
};

export default deleteJoinCodeHandler;
