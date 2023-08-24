import type { Term } from "@quenti/prisma/client";

export const generateDistractors = (
  term: Term,
  allTerms: Term[],
  count: number,
): Term[] => {
  if (count > 4) throw new Error("Cannot generate more than 4 distractors");
  const distractors = new Set<Term>();

  // The pool of distractors is all terms at most 4 to the left and right of the term
  const pool = allTerms.filter(
    (t) =>
      t.id !== term.id && t.rank >= term.rank - 4 && t.rank <= term.rank + 4,
  );

  while (distractors.size < count) {
    const index = Math.floor(Math.random() * pool.length);
    distractors.add(pool[index]!);
  }

  return Array.from(distractors);
};
