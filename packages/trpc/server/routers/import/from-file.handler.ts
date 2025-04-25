import { prisma } from "@quenti/prisma";
import { parseCsv } from "../../../../../apps/next/src/server/integrations/csv";
import { parseJson } from "../../../../../apps/next/src/server/integrations/json";
import { parseMarkdown } from "../../../../../apps/next/src/server/integrations/markdown";
import { parseAnkiApkg } from "../../../../../apps/next/src/server/integrations/anki";

import { TRPCError } from "@trpc/server";
import type { FromFileInput } from "./from-file.schema";

/**
 * Handler para o procedimento `import.fromFile`.
 * Recebe sempre { ctx, input }, onde:
 *  - ctx.session.user.id é o ID do usuário
 *  - input.fileName / input.fileContent vêm do front-end
 */
export async function fromFileHandler({
  ctx,
  input,
}: {
  ctx: { session: { user: { id: string } } };
  input: FromFileInput;
}) {
  const { fileName, fileContent } = input as unknown as { fileName: string; fileContent: string };
  const userId = ctx.session.user.id;

  // Detectar extensão
  const ext = fileName.split(".").pop()?.toLowerCase();
  let cards: { term: string; definition: string }[] = [];

  switch (ext) {
    case "csv":
      cards = parseCsv(fileContent);
      break;
    case "json":
      cards = parseJson(fileContent);
      break;
    case "md":
    case "markdown":
      cards = parseMarkdown(fileContent);
      break;
    case "apkg":
      cards = await parseAnkiApkg(fileContent);
      break;
    default:
      throw new TRPCError({ code: "BAD_REQUEST", message: "Formato não suportado." });
  }

  if (cards.length === 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhum flashcard encontrado." });
  }

  // Criar StudySet
  const title = fileName.replace(/\.[^/.]+$/, "");
  const set = await prisma.studySet.create({
    data: { title, userId, description: "Default description" },
  });

  // Inserir termos em lote
  await prisma.term.createMany({
    data: cards.map((c) => ({
      studySetId: set.id,
      word: c.term,
      definition: c.definition,
      rank: 0, // Provide a default value for rank or calculate it as needed
    })),
  });

  return {
    createdSetId: set.id,
    title,
    count: cards.length,
  };
}

export default fromFileHandler;