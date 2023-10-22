export interface EntailmentResult {
  label: "entailment" | "contradiction" | "neutral";
  score: number;
}

export interface CortexGraderResponse {
  answer: string;
  input: string;
  evaluation: boolean;
  similarity: number;
  entailment: EntailmentResult | null;
}
