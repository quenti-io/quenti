import type { NonNullableUserContext } from "../../lib/types";
import type { TStarTermSchema } from "./star-term.schema";

type StarTermOptions = {
  ctx: NonNullableUserContext;
  input: TStarTermSchema;
};

export const starTermHandler = async ({ ctx, input }: StarTermOptions) => {
  // It's possible that the user hasn't seen the set outside of the folder,
  // and doesn't have a container created yet
  const container = await ctx.prisma.container.upsert({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.studySetId,
        type: "StudySet",
      },
    },
    create: {
      userId: ctx.session.user.id,
      entityId: input.studySetId,
      viewedAt: new Date(),
      type: "StudySet",
    },
    update: {},
  });

  await ctx.prisma.starredTerm.create({
    data: {
      termId: input.termId,
      containerId: container.id,
      userId: ctx.session.user.id,
    },
  });
};

export default starTermHandler;
