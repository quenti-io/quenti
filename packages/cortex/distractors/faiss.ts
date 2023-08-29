import { IndexFlatL2 } from "faiss-node";

/**
 * @param vectors - the 768-dimensional vectors to generate an index from
 */
export const generateIndex = (vectors: number[][]) => {
  const index = new IndexFlatL2(768);
  for (const vector of vectors) {
    index.add(vector);
  }
  return index;
};

/**
 * @param index - the 768-dimensional index to search through
 * @param vectors - the 768-dimensional vectors to search through
 * @returns the three nearest indices from the vectors array to the search vector
 */
export const getThreeNearest = (
  index: IndexFlatL2,
  search: number[],
): number[] => {
  const k = 4;
  const results = index.search(search, k);
  return results.labels.slice(1);
};
