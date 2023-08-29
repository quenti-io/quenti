import { placeholderLanguage } from "@quenti/core";
import type { WriteData } from "@quenti/interfaces";
import { getRandom } from "@quenti/lib/array";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";

import { Input, Stack, useColorModeValue } from "@chakra-ui/react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { EvaluatedFalse, EvaluatedTrue } from "../evaluated";
import { GenericLabel } from "../generic-label";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const WriteCard: React.FC<CardProps> = ({ i, result }) => {
  const wordLanguage = useTestContext((s) => s.wordLanguage);
  const definitionLanguage = useTestContext((s) => s.definitionLanguage);
  const { question, answer, data } = useCardSelector<WriteData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);
  const onAnswerDelegate = useTestContext((s) => s.onAnswerDelegate);

  const inputBg = useColorModeValue("gray.100", "gray.700");
  const placeholderColor = useColorModeValue("gray.600", "gray.400");

  const evaluation = result ? data.evaluation : undefined;

  const remark =
    evaluation !== undefined
      ? getRandom(evaluation ? CORRECT : INCORRECT)
      : undefined;

  return (
    <>
      <PromptDisplay
        label={question.answerMode == "Definition" ? "Term" : "Definition"}
        content={word(question.answerMode, data.term, "prompt")}
      />
      <Stack>
        <GenericLabel evaluation={evaluation}>
          {remark ?? "Your answer"}
        </GenericLabel>
        {result ? (
          evaluation ? (
            <EvaluatedTrue>{answer || ""}</EvaluatedTrue>
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
