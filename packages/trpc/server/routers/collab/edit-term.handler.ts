import type { NonNullableUserContext } from "../../lib/types";
import { serialize } from "../terms/utils/serialize";
import { getSubmissionOrThrow, saveSubmisson } from "./common/submission";
import type { TEditTermSchema } from "./edit-term.schema";

type EditTermOptions = {
  ctx: NonNullableUserContext;
  input: TEditTermSchema;
};

export const editTermHandler = async ({ ctx, input }: EditTermOptions) => {
  await getSubmissionOrThrow(input.submissionId, ctx.session.user.id);

  const { plainText: word, richText: wordRichText } = serialize(
    input.word,
    input.wordRichText,
    false,
  );
  const { plainText: definition, richText: definitionRichText } = serialize(
    input.definition,
    input.definitionRichText,
    false,
  );

  const term = await ctx.prisma.term.update({
    where: {
      id_submissionId: {
        id: input.id,
        submissionId: input.submissionId,
      },
      authorId: ctx.session.user.id,
      ephemeral: true,
    },
    data: {
      word,
      definition,
      wordRichText,
      definitionRichText,
    },
  });

  await saveSubmisson(input.submissionId);
  return term;
};

export default editTermHandler;
