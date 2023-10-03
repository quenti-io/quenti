import { GenericLabel } from "@quenti/components";
import {
  EvaluatedFalse,
  EvaluatedTrue,
  PromptDisplay,
} from "@quenti/components/test";
import { placeholderLanguage } from "@quenti/core";
import type { WriteData } from "@quenti/interfaces";

import { HStack, Input, Stack, useColorModeValue } from "@chakra-ui/react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { CortexGraded } from "../cortex-graded";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const WriteCard: React.FC<CardProps> = ({ i, result }) => {
  const wordLanguage = useTestContext((s) => s.wordLanguage);
  const definitionLanguage = useTestContext((s) => s.definitionLanguage);
  const { question, answer, data, remarks } = useCardSelector<WriteData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);
  const onAnswerDelegate = useTestContext((s) => s.onAnswerDelegate);

  const inputBg = useColorModeValue("gray.100", "gray.700");
  const placeholderColor = useColorModeValue("gray.600", "gray.400");

  const evaluation = result ? data.evaluation : undefined;
  const remark = result ? remarks?.[0] : undefined;

  return (
    <>
      <PromptDisplay
        label={question.answerMode == "Definition" ? "Term" : "Definition"}
        content={word(question.answerMode, data.term, "prompt")}
      />
      <Stack>
        <HStack justifyContent="space-between" pr="2">
          <GenericLabel evaluation={evaluation}>
            {remark?.remark ?? "Your answer"}
          </GenericLabel>
          {data.cortexResponse && (
            <CortexGraded response={data.cortexResponse} />
          )}
        </HStack>
        {result ? (
          evaluation ? (
            <Stack spacing="6">
              <EvaluatedTrue>{answer || ""}</EvaluatedTrue>
              {data.cortexResponse && (
                <Stack spacing="2">
                  <GenericLabel>
                    Original{" "}
                    {question.answerMode == "Definition"
                      ? "definition"
                      : "term"}
                  </GenericLabel>
                  <EvaluatedTrue>
                    {word(question.answerMode, data.term, "answer")}
                  </EvaluatedTrue>
                </Stack>
              )}
            </Stack>
          ) : (
            <Stack spacing="6">
              <EvaluatedFalse>{answer || ""}</EvaluatedFalse>
              <Stack spacing="2">
                <GenericLabel>
                  Correct{" "}
                  {question.answerMode == "Definition" ? "definition" : "term"}
                </GenericLabel>
                <EvaluatedTrue>
                  {word(question.answerMode, data.term, "answer")}
                </EvaluatedTrue>
              </Stack>
            </Stack>
          )
        ) : (
          <Input
            id={`write-card-input-${i}`}
            placeholder={`Type the ${placeholderLanguage(
              wordLanguage,
              definitionLanguage,
              question.answerMode,
            )}`}
            py="6"
            px="4"
            rounded="lg"
            fontWeight={700}
            bg={inputBg}
            variant="flushed"
            _placeholder={{
              color: placeholderColor,
            }}
            value={answer}
            onChange={(e) => {
              if (e.target.value.trim().length > 0) {
                answerQuestion(i, e.target.value, true, true);
              } else clearAnswer(i);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onAnswerDelegate(i);
              }
            }}
          />
        )}
      </Stack>
    </>
  );
};
