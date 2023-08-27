import { Heading, Stack } from "@chakra-ui/react";

import { useTestContext } from "../../stores/use-test-store";
import { TestCardGap } from "./card-gap";
import { CardWrapper } from "./card-wrapper";
import { ResultsCard } from "./results-card";

export const ResultsView = () => {
  const result = useTestContext((s) => s.result!);
  const questionCount = useTestContext((s) => s.questionCount);
  const outline = useTestContext((s) => s.outline);

  return (
    <Stack spacing="6">
      <Heading>Your Results</Heading>
      <ResultsCard />
      <Stack spacing="0">
        {outline.map(({ type, count, index }) => (
          <>
            <TestCardGap
              type="question"
              index={index}
              numQuestions={questionCount}
              count={count}
              correctness={result.byQuestion[index]!.correct}
            />
            <CardWrapper type={type} i={index} />
          </>
        ))}
      </Stack>
    </Stack>
  );
};
