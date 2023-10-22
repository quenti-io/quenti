import type { NonNullableUserContext } from "../../lib/types";
import type { TSetExtendedFeedbackBankSchema } from "./set-extended-feedback-bank.schema";

type SetExtendedFeedbackBankOptions = {
  ctx: NonNullableUserContext;
  input: TSetExtendedFeedbackBankSchema;
};

export const setExtendedFeedbackBankHandler = async ({
  ctx,
  input,
}: SetExtendedFeedbackBankOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      extendedFeedbackBank: input.extendedFeedbackBank,
    },
  });
};

export default setExtendedFeedbackBankHandler;
