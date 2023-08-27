import { Box, Button, Heading, Stack, VStack } from "@chakra-ui/react";

import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useTestContext } from "../../stores/use-test-store";
import { TestCardGap } from "./card-gap";
import { CardWrapper } from "./card-wrapper";

interface TestViewProps {
  onSubmit: () => void;
}

export const TestView: React.FC<TestViewProps> = ({ onSubmit }) => {
  const { title } = useSetFolderUnison();
  const outline = useTestContext((s) => s.outline);
  const questionCount = useTestContext((s) => s.questionCount);

  return (
    <Stack spacing="0" pb="20" w="full">
      <TestCardGap type="start" title={title} />
      {outline.map(({ type, count, index }) => (
        <>
          <TestCardGap
            type="question"
            index={index}
            numQuestions={questionCount}
            count={count}
          />
          <CardWrapper type={type} i={index} />
        </>
      ))}
      <Box position="relative">
        <TestCardGap type="finish" />
        <VStack mt="10" spacing="6" h="24" w="full" pr="4">
          <Heading size="md" m="0">
            Ready to submit your test?
          </Heading>
          <Button size="lg" fontSize="md" onClick={onSubmit}>
            Check answers
          </Button>
        </VStack>
      </Box>
    </Stack>
  );
};
