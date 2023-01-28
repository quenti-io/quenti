import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import type { Question } from "../../../interfaces/question";
import { useLearnContext } from "../../../stores/use-learn-store";

export interface WriteCardProps {
  active: Question;
}

export const WriteCard: React.FC<WriteCardProps> = ({ active }) => {
  const status = useLearnContext((s) => s.status);
  const [guess, setGuess] = React.useState("");

  if (status === "correct") return <CorrectState />;
  if (status === "incorrect")
    return <IncorrectState active={active} guess={guess} />;

  return <InputState active={active} onSubmit={setGuess} />;
};

interface ActiveProps {
  active: Question;
}

const InputState: React.FC<
  ActiveProps & { onSubmit: (guess: string) => void }
> = ({ active, onSubmit }) => {
  const inputBg = useColorModeValue("gray.100", "gray.900");
  const placeholderColor = useColorModeValue("gray.600", "gray.200");

  const [answer, setAnswer] = React.useState("");

  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <Text fontWeight={600} color="gray.400">
          Your answer
        </Text>
        <Input
          placeholder="Type the answer"
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
          onChange={(e) => setAnswer(e.target.value)}
        />
      </Stack>
      <Flex justifyContent="end">
        <ButtonGroup>
          <Button variant="ghost">Don&apos;t know?</Button>
          <Button
            onClick={() => {
              onSubmit(answer.trim());

              if (
                answer.trim().toLowerCase() ==
                active.term.definition.trim().toLowerCase()
              ) {
                answerCorrectly(active.term.id);
              } else {
                answerIncorrectly(active.term.id);
              }
            }}
          >
            Answer
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};

const CorrectState = () => {
  const colorScheme = useColorModeValue("green.600", "green.200");

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
          Excellent!
        </Text>
        <AnswerCard text="The correct answer" correct />
      </Stack>
    </motion.div>
  );
};

const IncorrectState: React.FC<ActiveProps & { guess: string }> = ({
  active,
  guess,
}) => {
  const controls = useAnimationControls();

  const colorScheme = useColorModeValue("red.600", "red.200");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const fullStackRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);

  const [checkVisible, setCheckVisible] = React.useState(false);

  React.useEffect(() => {
    controls.set({
      height: `${stackRef.current!.clientHeight}px`,
    });
    controls.start({
      height: `${fullStackRef.current!.clientHeight}px`,
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    });

    setTimeout(() => setCheckVisible(true), 1000);
  }, []);

  return (
    <motion.div
      style={{
        overflow: "hidden",
      }}
      animate={controls}
    >
      <Stack spacing={6} ref={fullStackRef}>
        <Stack spacing={4} ref={stackRef}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight={600} color={colorScheme}>
              Incorrect!
            </Text>
            <Button size="sm" variant="ghost">
              Override: I was correct
            </Button>
          </Flex>
          <AnswerCard text={guess} correct={false} />
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
              text={active.term.definition}
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
  text: string;
  correct: boolean;
  showIcon?: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  text,
  correct,
  showIcon = true,
}) => {
  const correctBg = useColorModeValue("green.200", "green.600");
  const correctColor = useColorModeValue("green.600", "green.200");
  const incorrectColor = useColorModeValue("red.600", "red.200");

  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      w="full"
      px="8"
      py="4"
      border="2px"
      bg={correct ? correctBg : "transparent"}
      borderColor={correct ? correctColor : incorrectColor}
      color={correct ? correctColor : incorrectColor}
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
          size="lg"
          whiteSpace="normal"
          color={textColor}
          textAlign="start"
          fontWeight="normal"
        >
          {text}
        </Text>
      </Flex>
    </Box>
  );
};
