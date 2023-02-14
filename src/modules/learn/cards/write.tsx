import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { diffChars } from "diff";
import { motion, useAnimationControls } from "framer-motion";
import levenshtein from "js-levenshtein";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { useSet } from "../../../hooks/use-set";
import type { Question } from "../../../interfaces/question";
import { evaluate } from "../../../lib/evaluator";
import { placeholderLanguage } from "../../../lib/language";
import { useLearnContext, word } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";
import { getRandom } from "../../../utils/array";

export interface WriteCardProps {
  active: Question;
}

export const WriteCard: React.FC<WriteCardProps> = ({ active }) => {
  const status = useLearnContext((s) => s.status);
  const [guess, setGuess] = React.useState<string | undefined>();

  if (status === "correct") return <CorrectState active={active} />;
  if (status === "incorrect")
    return <IncorrectState active={active} guess={guess} />;

  return <InputState active={active} onSubmit={setGuess} />;
};

interface ActiveProps {
  active: Question;
}

const InputState: React.FC<
  ActiveProps & { onSubmit: (guess?: string) => void }
> = ({ active, onSubmit }) => {
  const { experience, wordLanguage, definitionLanguage } = useSet();
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);
  const specialCharacters = useLearnContext((s) => s.specialCharacters);

  const inputBg = useColorModeValue("gray.100", "gray.900");
  const placeholderColor = useColorModeValue("gray.600", "gray.200");
  const characterTextColor = useColorModeValue("black", "white");

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
    if (
      evaluate(
        active.answerMode == "Definition" ? definitionLanguage : wordLanguage,
        answer,
        word(active.answerMode, active.term, "answer")
      )
    ) {
      answerCorrectly(active.term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          experienceId: experience.id,
          correctness: 2,
          appearedInRound: active.term.appearedInRound || 0,
          incorrectCount: active.term.incorrectCount,
        }))();
    } else {
      answerIncorrectly(active.term.id);
    }
  };

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <Text fontWeight={600} color="gray.400">
          Your answer
        </Text>
        {!!specialCharacters.length && (
          <HStack>
            {specialCharacters.sort().map((c, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline"
                fontWeight={600}
                onClick={() => {
                  setAnswer(answer + c);
                  inputRef.current?.focus();
                }}
              >
                <Text color={characterTextColor}>{c}</Text>
              </Button>
            ))}
          </HStack>
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

const CorrectState: React.FC<ActiveProps> = ({ active }) => {
  const feedbackBank = useLearnContext((s) => s.feedbackBank);
  const colorScheme = useColorModeValue("green.600", "green.200");

  const [remark] = React.useState(getRandom(feedbackBank.correct));

  return (
    <motion.div
      initial={{
        translateY: -16,
        opacity: 0.5,
      }}
      animate={{
        translateY: 0,
        opacity: 1,
      }}
    >
      <Stack spacing={4} pb="53px">
        <Text fontWeight={600} color={colorScheme}>
          {remark}
        </Text>
        <AnswerCard
          text={word(active.answerMode, active.term, "answer")}
          correct
        />
      </Stack>
    </motion.div>
  );
};

const IncorrectState: React.FC<ActiveProps & { guess?: string }> = ({
  active,
  guess,
}) => {
  const { experience } = useSet();
  const overrideCorrect = useLearnContext((s) => s.overrideCorrect);

  const feedbackBank = useLearnContext((s) => s.feedbackBank);
  const [remark] = React.useState(getRandom(feedbackBank.incorrect));

  const put = api.studiableTerms.put.useMutation();

  const controls = useAnimationControls();
  const colorScheme = useColorModeValue("red.600", "red.200");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const fullStackRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);

  const [checkVisible, setCheckVisible] = React.useState(false);

  const handleOverrideCorrect = () => {
    overrideCorrect();

    void (async () =>
      await put.mutateAsync({
        id: active.term.id,
        experienceId: experience.id,
        correctness: 2,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount,
      }))();
  };

  React.useEffect(() => {
    void (async () => {
      controls.set({
        height: `${stackRef.current!.clientHeight + 12}px`,
      });
      await controls.start({
        height: `${fullStackRef.current!.clientHeight + 12}px`,
        transition: {
          duration: 0.5,
          delay: 0.5,
        },
      });
    })();

    setTimeout(() => setCheckVisible(true), 1000);
  }, [controls]);

  const diff = guess
    ? diffChars(guess, word(active.answerMode, active.term, "answer"))
    : [];
  const showDiff = guess
    ? levenshtein(guess, word(active.answerMode, active.term, "answer")) <= 3
    : false;

  return (
    <motion.div
      style={{
        overflow: "hidden",
      }}
      animate={controls}
    >
      <Stack spacing={6} marginTop="0" ref={fullStackRef}>
        <Stack spacing={4} ref={stackRef}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight={600} color={guess ? colorScheme : grayText}>
              {guess ? remark : "You skipped this term"}
            </Text>
            {guess && (
              <Button size="sm" variant="ghost" onClick={handleOverrideCorrect}>
                Override: I was correct
              </Button>
            )}
          </Flex>
          <AnswerCard
            text={guess || "Skipped"}
            correct={false}
            skipped={!guess}
          />
        </Stack>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1 } }}
        >
          <Stack spacing={4}>
            <Text fontWeight={600} color={grayText}>
              Correct answer
            </Text>
            <AnswerCard
              text={
                <>
                  {showDiff
                    ? diff.map((x, i) =>
                        x.added && x.value.length <= 3 ? (
                          <b key={i}>{x.value}</b>
                        ) : x.removed ? (
                          ""
                        ) : (
                          x.value
                        )
                      )
                    : word(active.answerMode, active.term, "answer")}
                </>
              }
              correct
              showIcon={checkVisible}
            />
          </Stack>
        </motion.div>
      </Stack>
    </motion.div>
  );
};

interface AnswerCardProps {
  text: string | React.ReactNode;
  correct: boolean;
  skipped?: boolean;
  showIcon?: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  text,
  correct,
  skipped = false,
  showIcon = true,
}) => {
  const correctBg = useColorModeValue("green.200", "green.600");
  const correctColor = useColorModeValue("green.600", "green.200");
  const incorrectColor = useColorModeValue("red.600", "red.200");

  const grayColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      w="full"
      px="8"
      py="4"
      border="2px"
      bg={correct ? correctBg : "transparent"}
      borderColor={
        correct ? correctColor : !skipped ? incorrectColor : grayColor
      }
      color={correct ? correctColor : !skipped ? incorrectColor : grayColor}
      rounded="lg"
    >
      <Flex alignItems="center" w="full" gap={4}>
        {showIcon ? (
          <div style={{ transform: "scale(1.125)" }}>
            {correct ? <AnimatedCheckCircle /> : <AnimatedXCircle />}
          </div>
        ) : (
          <div style={{ width: 24, height: 24 }} />
        )}
        <Text
          whiteSpace="normal"
          color={!skipped ? textColor : grayColor}
          textAlign="start"
          fontWeight="normal"
        >
          {text}
        </Text>
      </Flex>
    </Box>
  );
};
