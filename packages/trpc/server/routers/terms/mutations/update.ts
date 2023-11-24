import { prisma } from "@quenti/prisma";
import { Prisma, type Term } from "@quenti/prisma/client";

export const bulkUpdateTerms = async (
  terms: Pick<
    Term,
    | "id"
    | "word"
    | "definition"
    | "wordRichText"
    | "definitionRichText"
    | "rank"
  >[],
  studySetId: string,
) => {
  const vals = terms.map((term) => [
    term.id,
    term.word,
    term.definition,
    term.wordRichText,
    term.definitionRichText,
    term.rank,
    studySetId,
  ]);

  const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);
  const query = Prisma.sql`
    INSERT INTO Term (id, word, definition, wordRichText, definitionRichText, \`rank\`, studySetId)
    VALUES ${Prisma.join(formatted)}
    ON DUPLICATE KEY UPDATE word = VALUES(word), definition = VALUES(definition), wordRichText = VALUES(wordRichText), definitionRichText = VALUES(definitionRichText)
  `;

  await prisma.$executeRaw(query);
};
