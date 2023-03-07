import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { ScriptFormatter } from "../../../../components/script-formatter";
import { useEventCallback } from "../../../../hooks/use-event-callback";
import { useSet } from "../../../../hooks/use-set";
import type { Question } from "../../../../interfaces/question";
import { evaluate, EvaluationResult } from "../../../../lib/evaluator";
import { placeholderLanguage } from "../../../../lib/language";
import { useExperienceContext } from "../../../../stores/use-experience-store";
import { useLearnContext, word } from "../../../../stores/use-learn-store";
import { api } from "../../../../utils/api";

export interface InputStateProps {
  active: Question;
  onSubmit: (guess?: string) => void;
}

export const InputState: React.FC<InputStateProps> = ({ active, onSubmit }) => {
  const { experience, wordLanguage, definitionLanguage } = useSet();
  const mutlipleAnswerMode = useExperienceContext((s) => s.multipleAnswerMode);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);
  const answerUnknownPartial = useLearnContext((s) => s.answerUnknownPartial);
  const specialCharacters = useLearnContext((s) => s.specialCharacters);

  const inputBg = useColorModeValue("gray.100", "gray.900");
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
      word(active.answerMode, active.term, "answer")
    );

    if (evaluation === EvaluationResult.Correct) {
      answerCorrectly(active.term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          experienceId: experience.id,
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
        cursorPosition + 1
      );
    });
  };

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <Text fontWeight={600} color="gray.400">
          Your answer
        </Text>
        {!!specialCharacters.length && (
          <Box>
            <div style={{ margin: -4 }}>
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
            active.answerMode
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

const CharacterButtonWrapper: React.FC<{
  character: string;
  handler: (c: string) => void;
}> = ({ character, handler }) => {
  const callback = useEventCallback(() => handler(character));

  return <CharacterButtonPure character={character} onClick={callback} />;
};

const CharacterButton: React.FC<{ character: string; onClick: () => void }> = ({
  character,
  onClick,
}) => {
  const characterTextColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Button
      size="sm"
      variant="outline"
      display="inline-block"
      m="1"
      fontWeight={600}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Text color={characterTextColor}>
        <ScriptFormatter>{character}</ScriptFormatter>
      </Text>
    </Button>
  );
};

const CharacterButtonPure = React.memo(CharacterButton);
