import { env } from "@quenti/env/server";
import { deleteTermAssets } from "@quenti/images/server";
import { Prisma } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { MAX_TERM } from "../../common/constants";
import { censorRichText, profanity } from "../../common/profanity";
import { markCortexStale } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import { termsSelect } from "../study-sets/queries";
import { reorder } from "../terms/mutations/reorder";
import { bulkUpdateTerms } from "../terms/mutations/update";
import { getSubmissionOrThrow } from "./common/submission";
import type { TSubmitSchema } from "./submit.schema";

type SubmitOptions = {
  ctx: NonNullableUserContext;
  input: TSubmitSchema;
};

export const submitHandler = async ({ ctx, input }: SubmitOptions) => {
  const submission = await getSubmissionOrThrow(
    input.submissionId,
    ctx.session.user.id,
    {
      assignment: {
        select: {
          id: true,
          type: true,
          studySet: {
            select: {
              id: true,
              collab: {
                select: {
                  minTermsPerUser: true,
                  maxTermsPerUser: true,
                  type: true,
                },
              },
            },
          },
        },
      },
      member: {
        select: {
          id: true,
        },
      },
    },
  );

  const studySet = submission?.assignment?.studySet;
  const collab = submission?.assignment?.studySet?.collab;

  if (
    !submission ||
    submission.assignment.type !== "Collab" ||
    !studySet ||
    !collab
  )
    throw new TRPCError({ code: "NOT_FOUND" });

  // Submission meets basic criteria, now check terms
  const terms = await ctx.prisma.term.findMany({
    where: {
      submissionId: input.submissionId,
    },
    select: termsSelect,
  });

  if (collab.type !== "Default")
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
    });

  const acceptedTerms = terms.filter(
    (term) => term.word.trim().length || term.definition.trim().length,
  );

  if (
    acceptedTerms.length < (collab.minTermsPerUser || 0) ||
    acceptedTerms.length > (collab.maxTermsPerUser || 0)
  )
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Submission does not meet term requirements.",
    });

  // Perform what is essentially a bulk edit operation to handle profanity
  const creatable = acceptedTerms.map((t) => ({
    ...t,
    word: profanity.censor(t.word.slice(0, MAX_TERM)),
    definition: profanity.censor(t.definition.slice(0, MAX_TERM)),
    wordRichText: t.wordRichText
      ? censorRichText(t.wordRichText as object)
      : null,
    definitionRichText: t.definitionRichText
      ? censorRichText(t.definitionRichText as object)
      : null,
  }));

  // Edit all term content
  await bulkUpdateTerms(creatable, studySet.id);

  // Delete all previously submitted terms
  // TODO: not the most ideal way to do this, but flagging as ephemeral causes issues with studiable terms
  // + other relations

  // Find all CDN asset urls that are no longer used
  const deleteAssetTerms = await ctx.prisma.term.findMany({
    where: {
      studySetId: studySet.id,
      authorId: ctx.session.user.id,
      ephemeral: false,
      assetUrl: {
        startsWith: env.ASSETS_BUCKET_URL,
        notIn: creatable.map((t) => t.assetUrl).filter((x) => !!x) as string[],
      },
    },
    select: {
      assetUrl: true,
    },
  });

  if (deleteAssetTerms.length) {
    await deleteTermAssets(
      deleteAssetTerms.map((t) => new URL(t.assetUrl!).pathname.slice(1)),
    );
  }

  const deleted = await ctx.prisma.term.deleteMany({
    where: {
      studySetId: studySet.id,
      authorId: ctx.session.user.id,
      ephemeral: false,
    },
  });

  if (deleted.count) {
    // After deleting terms, we need to reorder the ranks
    await reorder(ctx.prisma, studySet.id);
  }

  // Now "append" to the set by properly setting the rank and setting ephemeral to false
  const publishedCount = await ctx.prisma.term.count({
    where: { studySetId: studySet.id, ephemeral: false },
  });

  // Perform an update via insert with ON DUPLICATE KEY UPDATE (all required columns)
  const vals = terms
    .sort((a, b) => a.rank - b.rank)
    .map((t, i) => [
      t.id,
      t.word,
      t.definition,
      publishedCount + i,
      studySet.id,
    ]);
  const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);
  // Only update the rank and ephemeral columns
  const query = Prisma.sql`
    INSERT INTO Term (id, word, definition, \`rank\`, studySetId)
    VALUES ${Prisma.join(formatted)}
    ON DUPLICATE KEY UPDATE \`rank\` = VALUES(\`rank\`), ephemeral = 0
  `;

  await ctx.prisma.$executeRaw(query);

  // Now create a collaborator if one does not exist
  await ctx.prisma.studySetCollaborator.upsert({
    where: {
      studySetId_userId: {
        studySetId: studySet.id,
        userId: ctx.session.user.id,
      },
    },
    create: {
      studySetId: studySet.id,
      userId: ctx.session.user.id,
    },
    update: {},
  });

  await markCortexStale(studySet.id);

  // All of the terms are published now, update the submission
  await ctx.prisma.submission.update({
    where: {
      id: input.submissionId,
    },
    data: {
      submittedAt: new Date(),
    },
  });

  const firstTime =
    (await ctx.prisma.submission.count({
      where: {
        assignmentId: submission.assignment.id,
        member: {
          userId: ctx.session.user.id,
        },
      },
    })) <= 1;

  return { firstTime };
};

export default submitHandler;
