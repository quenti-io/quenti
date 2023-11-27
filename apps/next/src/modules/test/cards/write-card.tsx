import React from "react";

import { GenericLabel } from "@quenti/components";
import { EvaluatedFalse, EvaluatedTrue } from "@quenti/components/test";
import { RichPromptDisplay } from "@quenti/components/test/rich-prompt-display";
import { placeholderLanguage } from "@quenti/core";
import type { WriteData } from "@quenti/interfaces";

import { Box, HStack, Input, Stack, useColorModeValue } from "@chakra-ui/react";

import { CharacterButtonWrapper } from "../../../components/special-characters";
import { SquareAssetPreview } from "../../../components/terms/square-asset-preview";
import { useTestContext } from "../../../stores/use-test-store";
import { richWord, word } from "../../../utils/terms";
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
  const specialCharacters = useTestContext((s) => s.specialCharacters);

  const evaluation = result ? data.evaluation : undefined;
  const remark = result ? remarks?.[0] : undefined;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = (c: string) => {
    const value = answer || "";
    const cursorPosition = inputRef.current!.selectionStart || value.length;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    answerQuestion(i, textBeforeCursor + c + textAfterCursor, true, true);

    inputRef.current?.focus();
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(
        cursorPosition + 1,
        cursorPosition + 1,
      );
    });
  };

  const inputBg = useColorModeValue("gray.100", "gray.700");
  const placeholderColor = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      <RichPromptDisplay
        label={question.answerMode == "Definition" ? "Term" : "Definition"}
        extra={
          question.answerMode == "Word" &&
          data.term.assetUrl && (
            <SquareAssetPreview
              rounded={8}
              size={100}
              src={data.term.assetUrl || ""}
            />
          )
        }
        {...richWord(question.answerMode, data.term, "prompt")}
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
          <Stack spacing="3">
            {!!specialCharacters.length && (
              <Box>
                <div style={{ margin: -4, maxHeight: 128, overflowY: "auto" }}>
                  {specialCharacters.sort().map((c, i) => (
                    <CharacterButtonWrapper
                      key={i}
                      character={c}
                      handler={handleClick}
                    />
                  ))}
                </div>
              </Box>
            )}

            <Input
              ref={inputRef}
              autoComplete="off"
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
          </Stack>
        )}
      </Stack>
    </>
  );
};
