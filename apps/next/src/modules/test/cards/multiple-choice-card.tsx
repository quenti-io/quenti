import React from "react";

import type { MultipleChoiceData } from "@quenti/interfaces";
import { getRandom } from "@quenti/lib/array";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";

import { Box, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { IconCircleCheckFilled, IconCircleX } from "@tabler/icons-react";

import { ScriptFormatter } from "../../../components/script-formatter";
import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { Clickable } from "../clickable";
import { GenericLabel } from "../generic-label";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const MultipleChoiceCard: React.FC<CardProps> = ({ i, result }) => {
  const { question, answered, data } = useCardSelector<MultipleChoiceData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  const evaluation = result ? data.answer === data.term.id : undefined;

  const remark =
    evaluation !== undefined
      ? evaluation
        ? getRandom(CORRECT)
        : getRandom(INCORRECT)
      : undefined;

  const EvaluationWrapper: React.FC<
    React.PropsWithChildren<{ evaluation?: boolean }>
  > = ({ evaluation, children }) => {
    const Icon = evaluation ? IconCircleCheckFilled : IconCircleX;

    return (
      <HStack>
        {evaluation !== undefined && (
          <Box>
            <Icon size={18} />
          </Box>
        )}
        {children}
      </HStack>
    );
  };

  const Wrapper = evaluation !== undefined ? EvaluationWrapper : React.Fragment;

  const evaluateTerm = (term: string): boolean | undefined => {
    if (evaluation == undefined) return undefined;
    if (term == data.answer) return evaluation;
    if (term == data.term.id) return true;
    return undefined;
  };

  return (
    <>
      <PromptDisplay
        label={question.answerMode == "Definition" ? "Term" : "Definition"}
        content={word(question.answerMode, data.term, "prompt")}
      />
      <Stack spacing="2">
        <GenericLabel evaluation={evaluation}>
          {remark ??
            `Choose matching ${
              question.answerMode == "Definition" ? "definition" : "term"
            }`}
        </GenericLabel>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 6 }}>
          {data.choices.map((choice) => (
            <Clickable
              key={choice.id}
              isSelected={answered && data.answer == choice.id}
              disabled={result}
              evaluation={evaluateTerm(choice.id)}
              onClick={() => {
                if (data.answer !== choice.id)
                  answerQuestion<MultipleChoiceData>(i, choice.id);
                else clearAnswer(i);
              }}
            >
              <Wrapper evaluation={evaluateTerm(choice.id)}>
                <Text
                  size="lg"
                  whiteSpace="pre-wrap"
                  textAlign="start"
                  overflowWrap="anywhere"
                  fontWeight={
                    evaluateTerm(choice.id) !== undefined ? 500 : "normal"
                  }
                  style={
                    result
                      ? {
                          cursor: "text",
                          pointerEvents: "auto",
                          userSelect: "text",
                        }
                      : {}
                  }
                >
                  <ScriptFormatter>
                    {word(question.answerMode, choice, "answer")}
                  </ScriptFormatter>
                </Text>
              </Wrapper>
            </Clickable>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};
