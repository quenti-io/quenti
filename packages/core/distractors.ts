import { takeNRandom } from "@quenti/lib/array";
import type { Term } from "@quenti/prisma/client";

export const generateDistractors = (
  term: Term,
  pool: Term[],
  count: number,
): Term[] => {
  const distractors = new Array<Term>();

  const distractorPool = pool.filter(
    (t) =>
      t.id != term.id && t.rank >= term.rank - 4 && t.rank <= term.rank + 4,
  );

  distractors.push(...takeNRandom(distractorPool, count));
  return Array.from(distractors);
};
