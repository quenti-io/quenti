import { customAlphabet } from "nanoid";

import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateJoinCodeSchema } from "./create-join-code.schema";

type CreateJoinCodeOptions = {
  ctx: NonNullableUserContext;
  input: TCreateJoinCodeSchema;
};

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);

export const createJoinCodeHandler = async ({
  ctx,
  input,
}: CreateJoinCodeOptions) => {
  const joinCode = await ctx.prisma.classJoinCode.create({
    data: {
      classId: input.classId,
      sectionId: input.sectionId,
      code: nanoid(),
    },
  });

  return joinCode;
};

export default createJoinCodeHandler;
