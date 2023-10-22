import type { DefaultData } from "@quenti/interfaces";

import { useTestContext } from "../../stores/use-test-store";

export const useCardSelector = <D extends DefaultData>(i: number) => {
  const question = useTestContext((s) => s.timeline[i]!);
  const answered = useTestContext((s) => s.timeline[i]!.answered);
  const data = useTestContext((s) => s.timeline[i]!.data) as D;
  const answer = useTestContext(
    (s) => s.timeline[i]!.data.answer,
  ) as D["answer"];
  const remarks = useTestContext((s) => s.result?.remarks[i]);

  return { question, answered, data, answer, remarks };
};
