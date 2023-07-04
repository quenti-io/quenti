import {
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { ChoiceShortcutLayer } from "../../../components/choice-shortcut-layer";
import { ScriptFormatter } from "../../../components/script-formatter";
import { useAuthedSet } from "../../../hooks/use-set";
import type { Question } from "../../../interfaces/question";
import { useLearnContext, word } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";
import { getRandom } from "../../../utils/array";

interface ChoiceCardProps {
  active: Question;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ active }) => {
  const { container } = useAuthedSet();
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);
  const feedbackBank = useLearnContext((s) => s.feedbackBank);

  const getCorrect = () => getRandom(feedbackBank.correct)!;
  const getIncorrect = () => getRandom(feedbackBank.incorrect)!;

  const [remark, setRemark] = React.useState({
    correct: getCorrect(),
    incorrect: getIncorrect(),
  });

  React.useEffect(() => {
    setRemark({
      correct: getCorrect(),
      incorrect: getIncorrect(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.term.id, feedbackBank]);

  const put = api.studiableTerms.put.useMutation();

  const choose = (term: Term) => {
    if (term.id === active.term.id) {
      answerCorrectly(term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          containerId: container.id,
          mode: "Learn",
          correctness: 1,
          appearedInRound: active.term.appearedInRound || 0,
          incorrectCount: active.term.incorrectCount,
        }))();
    } else {
      answerIncorrectly(term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          containerId: container.id,
          mode: "Learn",
          correctness: -1,
          appearedInRound: active.term.appearedInRound || 0,
          incorrectCount: active.term.incorrectCount + 1,
        }))();
    }
  };

  const isCorrectTerm = (id: string) => !!answered && id === active.term.id;
  const isIncorrectTerm = (id: string) =>
    id === answered && status === "incorrect";
  const isHighlightedTerm = (id: string) =>
    isCorrectTerm(id) || isIncorrectTerm(id);

  const colorForTerm = (id: string) => {
    if (!answered) return "blue";

    if (isCorrectTerm(id)) return "green";
    else if (isIncorrectTerm(id)) return "red";

    return "blue";
  };

  const questionNumText = useColorModeValue("gray.800", "gray.200");
  const defaultBorder = useColorModeValue("blue.600", "blue.200");
  const correctBg = useColorModeValue("green.200", "green.600");
  const greenText = useColorModeValue("green.600", "green.200");
  const redText = useColorModeValue("red.600", "red.200");
  const textColor = useColorModeValue("black", "white");

  const text =
    status == "correct"
      ? remark.correct
      : status == "incorrect"
      ? remark.incorrect
      : `Choose matching ${
          active.answerMode == "Definition" ? "definition" : "term"
        }`;

  return (
    <>
      <Text
        fontWeight={600}
        color={
          status == "correct"
            ? greenText
            : status == "incorrect"
            ? redText
            : undefined
        }
      >
        {text}
      </Text>
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
        <ChoiceShortcutLayer
          choose={(i) => {
            if (active.choices.length > i) choose(active.choices[i]!);
          }}
        />
        {active.choices.map((choice, i) => (
          <GridItem h="auto" key={i}>
            <Button
              w="full"
              variant="outline"
              pointerEvents={answered ? "none" : "auto"}
              bg={isCorrectTerm(choice.id) ? correctBg : "transparent"}
              border="2px"
              px="8"
              py="5"
              h="full"
              colorScheme={colorForTerm(choice.id)}
              isDisabled={
                !!answered &&
                choice.id !== active.term.id &&
                choice.id !== answered
              }
              onClick={() => choose(choice)}
            >
              <Flex alignItems="center" w="full" gap={4}>
                {!answered || !isHighlightedTerm(choice.id) ? (
                  <Flex
                    border="solid 2px"
                    borderColor={defaultBorder}
                    rounded="full"
                    w="6"
                    h="6"
                    minW="6"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" lineHeight={0} color={questionNumText}>
                      {i + 1}
                    </Text>
                  </Flex>
                ) : isCorrectTerm(choice.id) ? (
                  <div style={{ transform: "scale(1.125)" }}>
                    <AnimatedCheckCircle />
                  </div>
                ) : (
                  <div style={{ transform: "scale(1.125)" }}>
                    <AnimatedXCircle />
                  </div>
                )}
                <Text
                  size="lg"
                  color={textColor}
                  whiteSpace="pre-wrap"
                  textAlign="start"
                  fontWeight="normal"
                >
                  <ScriptFormatter>
                    {word(active.answerMode, choice, "answer")}
                  </ScriptFormatter>
                </Text>
              </Flex>
            </Button>
          </GridItem>
        ))}
      </Grid>
    </>
  );
};
