import { similarity } from "ml-distance";

export class VectorStore {
  embeddings: number[][];

  constructor(embeddings: number[][]) {
    this.embeddings = embeddings;
  }

  search(search: number[], k = 3) {
    const results = this.embeddings
      .map((vector, index) => ({
        similarity: similarity.cosine(search, vector),
        index,
      }))
      .sort((a, b) => (a.similarity > b.similarity ? -1 : 1))
      .slice(1, k + 1);

    return results.map((r) => r.index);
  }
}
