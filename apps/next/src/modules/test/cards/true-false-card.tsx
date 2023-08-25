import type { TrueFalseData } from "@quenti/interfaces";

import {
  Box,
  FormLabel,
  Grid,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconCircleXFilled,
} from "@tabler/icons-react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { Clickable } from "../clickable";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";

export const TrueFalseCard = ({ i }: { i: number }) => {
  const { question, data } = useCardSelector<TrueFalseData>(i);

  const rightSide = data.distractor
    ? word(question.answerMode, data.distractor, "answer")
    : word(question.answerMode, data.term, "answer");

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  const trueSelected = data.answer === true;
  const falseSelected = data.answer === false;

  return (
    <>
      <Grid templateColumns="1fr 2px 1fr" gap={{ base: 1, md: 3 }}>
        <Box h="full" w="full">
          <PromptDisplay
            label={question.answerMode == "Definition" ? "Term" : "Definition"}
            content={word(question.answerMode, data.term, "prompt")}
          />
        </Box>
        <Box
          h="full"
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
        />
        <Box w="full" pl="4">
          <PromptDisplay
            label={question.answerMode == "Definition" ? "Definition" : "Term"}
            content={rightSide}
          />
        </Box>
      </Grid>
      <Stack spacing="2">
        <FormLabel>Choose an answer</FormLabel>
        <SimpleGrid columns={2} gap={{ base: 4, md: 6 }}>
          <Clickable
            isSelected={trueSelected}
            onClick={() => {
              if (!trueSelected) answerQuestion<TrueFalseData>(i, true);
              else clearAnswer(i);
            }}
          >
            <HStack>
              {trueSelected ? (
                <IconCircleCheckFilled size={18} />
              ) : (
                <IconCircleCheck size={18} />
              )}
              <Text>True</Text>
            </HStack>
          </Clickable>
          <Clickable
            isSelected={falseSelected}
            onClick={() => {
              if (!falseSelected) answerQuestion<TrueFalseData>(i, false);
              else clearAnswer(i);
            }}
          >
            <HStack>
              {falseSelected ? (
                <IconCircleXFilled size={18} />
              ) : (
                <IconCircleX size={18} />
              )}
              <Text>False</Text>
            </HStack>
          </Clickable>
        </SimpleGrid>
      </Stack>
    </>
  );
};
