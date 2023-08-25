import { useTestContext } from "../../stores/use-test-store";

export const useCardSelector = <D>(i: number) => {
  const question = useTestContext((s) => s.timeline[i]!);
  const answered = useTestContext((s) => s.timeline[i]!.answered);
  const data = useTestContext((s) => s.timeline[i]!.data) as D;

  useTestContext((s) => s.timeline[i]!.data.answer);

  return { question, answered, data };
};
