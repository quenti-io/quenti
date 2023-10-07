import React from "react";

import { GenericLabel } from "@quenti/components";
import { EvaluationResult, evaluate } from "@quenti/core/evaluator";
import { placeholderLanguage } from "@quenti/core/language";
import type { Question } from "@quenti/interfaces";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { CharacterButtonWrapper } from "../../../../components/special-characters";
import { useAuthedSet } from "../../../../hooks/use-set";
import { useContainerContext } from "../../../../stores/use-container-store";
import { useLearnContext } from "../../../../stores/use-learn-store";
import { word } from "../../../../utils/terms";

export interface InputStateProps {
  active: Question;
  onSubmit: (guess?: string) => void;
}

export const InputState: React.FC<InputStateProps> = ({ active, onSubmit }) => {
  const { container, wordLanguage, definitionLanguage } = useAuthedSet();
  const mutlipleAnswerMode = useContainerContext((s) => s.multipleAnswerMode);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);
  const answerUnknownPartial = useLearnContext((s) => s.answerUnknownPartial);
  const specialCharacters = useLearnContext((s) => s.specialCharacters);

  const inputBg = useColorModeValue("gray.100", "gray.800");
  const placeholderColor = useColorModeValue("gray.600", "gray.200");

  const [answer, setAnswer] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const put = api.studiableTerms.put.useMutation();

  const handleSubmit = (skip = false) => {
    if (skip) {
      onSubmit();
      answerIncorrectly(active.term.id);
      return;
    }

    if (!answer.trim().length) return;

    onSubmit(answer.trim());

    const evaluation = evaluate(
      active.answerMode == "Definition" ? definitionLanguage : wordLanguage,
      mutlipleAnswerMode,
      answer,
      word(active.answerMode, active.term, "answer"),
    );

    if (evaluation === EvaluationResult.Correct) {
      answerCorrectly(active.term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          containerId: container.id,
          mode: "Learn",
          correctness: 2,
          appearedInRound: active.term.appearedInRound || 0,
          incorrectCount: active.term.incorrectCount,
        }))();
    } else if (evaluation === EvaluationResult.Incorrect) {
      answerIncorrectly(active.term.id);
    } else {
      answerUnknownPartial();
    }
  };

  const handleClick = (c: string) => {
    const cursorPosition = inputRef.current!.selectionStart || answer.length;
    const textBeforeCursor = answer.substring(0, cursorPosition);
    const textAfterCursor = answer.substring(cursorPosition);
    setAnswer(textBeforeCursor + c + textAfterCursor);

    inputRef.current?.focus();
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(
        cursorPosition + 1,
        cursorPosition + 1,
      );
    });
  };

  return (
    <Stack spacing={6}>
      <Stack spacing="2">
        <GenericLabel>Your answer</GenericLabel>
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
            placeholder={`Type the ${placeholderLanguage(
              wordLanguage,
              definitionLanguage,
              active.answerMode,
            )}`}
            autoComplete="off"
            py="6"
            px="4"
            rounded="lg"
            fontWeight={700}
            bg={inputBg}
            variant="flushed"
            borderColor="transparent"
            _placeholder={{
              color: placeholderColor,
            }}
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTimeout(() => {
                  handleSubmit();
                });
              }
            }}
          />
        </Stack>
      </Stack>
      <Flex justifyContent="end">
        <ButtonGroup>
          <Button variant="ghost" onClick={() => handleSubmit(true)}>
            Don&apos;t know?
          </Button>
          <Button onClick={() => handleSubmit()}>Answer</Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
