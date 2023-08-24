import { useTestContext } from "../../stores/use-test-store";

export const useCardSelector = (i: number) => {
  const q = useTestContext((s) => s.timeline[i]!);
  const isAnswered = useTestContext((s) => s.timeline[i]!.answered);
  const answer = useTestContext((s) => s.timeline[i]!.entries[0]!.answer);

  return { q, isAnswered, answer };
};
