import { bulkGenerateDistractors } from "@quenti/cortex/distractors";
import { prisma } from "@quenti/prisma";

export const markCortexStale = async (id: string) => {
  await prisma.studySet.update({
    where: {
      id,
    },
    data: {
      cortexStale: true,
    },
  });
};

export const regenerateCortex = async (id: string) => {
  const terms = await prisma.term.findMany({
    where: {
      studySetId: id,
    },
    select: {
      id: true,
      word: true,
      definition: true,
    },
  });

  const distractors = await bulkGenerateDistractors(terms);
  await prisma.studySet.update({
    where: {
      id,
    },
    data: {
      distractors: {
        deleteMany: {},
        createMany: {
          data: distractors.map((d) => ({
            type: d.type == "word" ? "Word" : "Definition",
            termId: d.termId,
            distractingId: d.distractorId,
          })),
        },
      },
      cortexStale: false,
    },
  });

  return distractors;
};
