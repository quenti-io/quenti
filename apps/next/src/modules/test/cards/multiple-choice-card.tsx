import type { MultipleChoiceData } from "@quenti/interfaces";

import { FormLabel, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { ScriptFormatter } from "../../../components/script-formatter";
import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { Clickable } from "../clickable";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const MultipleChoiceCard: React.FC<CardProps> = ({ i }) => {
  const { question, answered, data } = useCardSelector<MultipleChoiceData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  return (
    <>
      <PromptDisplay
        label={question.answerMode == "Definition" ? "Term" : "Definition"}
        content={word(question.answerMode, data.term, "prompt")}
      />
      <Stack spacing="2">
        <FormLabel>
          Choose matching{" "}
          {question.answerMode == "Definition" ? "definition" : "term"}
        </FormLabel>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 6 }}>
          {data.choices.map((choice, ci) => (
            <Clickable
              key={ci}
              isSelected={answered && data.answer == choice.id}
              onClick={() => {
                if (data.answer !== choice.id)
                  answerQuestion<MultipleChoiceData>(i, choice.id);
                else clearAnswer(i);
              }}
            >
              <Text
                size="lg"
                whiteSpace="pre-wrap"
                textAlign="start"
                fontWeight="normal"
              >
                <ScriptFormatter>
                  {word(question.answerMode, choice, "answer")}
                </ScriptFormatter>
              </Text>
            </Clickable>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};
