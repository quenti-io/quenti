import React from "react";

import { GenericLabel } from "@quenti/components";
import { ScriptFormatter } from "@quenti/components/script-formatter";
import { Clickable } from "@quenti/components/test";
import { RichPromptDisplay } from "@quenti/components/test/rich-prompt-display";
import type { MultipleChoiceData } from "@quenti/interfaces";

import {
  Box,
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconCircleCheckFilled, IconCircleX } from "@tabler/icons-react";

import { SquareAssetPreview } from "../../../components/terms/square-asset-preview";
import { useTestContext } from "../../../stores/use-test-store";
import { richWord, word } from "../../../utils/terms";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const MultipleChoiceCard: React.FC<CardProps> = ({ i, result }) => {
  const { question, answered, data, remarks } =
    useCardSelector<MultipleChoiceData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  const evaluation = result ? data.answer === data.term.id : undefined;
  const remark = result ? remarks?.[0] : undefined;

  const EvaluationWrapper: React.FC<
    React.PropsWithChildren<{ evaluation?: boolean }>
  > = ({ evaluation, children }) => {
    const Icon = evaluation ? IconCircleCheckFilled : IconCircleX;

    return (
      <HStack w="full">
        {evaluation !== undefined && (
          <Box>
            <Icon size={18} />
          </Box>
        )}
        {children}
      </HStack>
    );
  };

  const Wrapper: React.FC<
    React.PropsWithChildren<{ evaluation: boolean | undefined }>
  > = ({ evaluation, children }) => {
    if (evaluation === undefined) return <>{children}</>;
    return (
      <EvaluationWrapper evaluation={evaluation}>{children}</EvaluationWrapper>
    );
  };

  const evaluateTerm = (term: string): boolean | undefined => {
    if (evaluation == undefined) return undefined;
    if (term == data.answer) return evaluation;
    if (term == data.term.id) return true;
    return undefined;
  };

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
      <Stack spacing="2">
        <GenericLabel evaluation={evaluation}>
          {remark?.remark ??
            `Choose matching ${
              question.answerMode == "Definition" ? "definition" : "term"
            }`}
        </GenericLabel>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 6 }}>
          {data.choices.map((choice) => (
            <GridItem key={choice.id} h="auto">
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
                  <HStack justifyContent="space-between" gap="4" w="full">
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
                    {question.answerMode == "Definition" && choice.assetUrl && (
                      <SquareAssetPreview
                        rounded={8}
                        size={60}
                        src={choice.assetUrl}
                      />
                    )}
                  </HStack>
                </Wrapper>
              </Clickable>
            </GridItem>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};
