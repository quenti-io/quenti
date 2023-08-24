import { Box, Grid, SimpleGrid } from "@chakra-ui/react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { Clickable } from "../clickable";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";

export const TrueFalseCard = ({ i }: { i: number }) => {
  const { q, isAnswered, answer } = useCardSelector(i);

  const entry = q.entries[0]!;
  const distractor = entry.distractors[0];
  const isTrue = !distractor;
  const rightSide = isTrue
    ? word(q.answerMode, entry.term, "answer")
    : word(q.answerMode, distractor, "answer");

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  const trueSelected =
    isAnswered && answer?.term == (isTrue ? entry.term.id : distractor.id);
  const falseSelected = isAnswered && !answer?.term;

  return (
    <>
      <Grid templateColumns="1fr 2px 1fr" gap="3">
        <Box h="full" w="full">
          <PromptDisplay
            label={q.answerMode == "Definition" ? "Term" : "Definition"}
            content={word(q.answerMode, q.entries[0]!.term, "prompt")}
          />
        </Box>
        <Box
          h="full"
          bg="gray.200"
          _dark={{
            bg: "gray.600",
          }}
        />
        <Box w="full" pl="4">
          <PromptDisplay
            label={q.answerMode == "Definition" ? "Definition" : "Term"}
            content={rightSide}
          />
        </Box>
      </Grid>
      <SimpleGrid columns={2} gap="6">
        <Clickable
          isSelected={trueSelected}
          onClick={() => {
            if (!trueSelected)
              answerQuestion(i, 0, isTrue ? entry.term.id : distractor.id);
            else clearAnswer(i, 0);
          }}
        >
          True
        </Clickable>
        <Clickable
          isSelected={falseSelected}
          onClick={() => {
            if (!falseSelected) answerQuestion(i, 0, undefined);
            else clearAnswer(i, 0);
          }}
        >
          False
        </Clickable>
      </SimpleGrid>
    </>
  );
};
