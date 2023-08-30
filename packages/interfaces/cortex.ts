export interface EntailmentResult {
  label: "ENTAILMENT" | "CONTRADICTION" | "NEUTRAL";
  score: number;
}

export interface CortexGraderResponse {
  answer: string;
  input: string;
  evaluation: boolean;
  similarity: number;
  entailment: EntailmentResult | null;
}
