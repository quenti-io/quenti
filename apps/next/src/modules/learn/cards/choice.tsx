import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import { GenericLabel } from "@quenti/components";
import type { FacingTerm, Question } from "@quenti/interfaces";
import { getRandom } from "@quenti/lib/array";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { ChoiceShortcutLayer } from "../../../components/choice-shortcut-layer";
import { ScriptFormatter } from "../../../components/script-formatter";
import { SquareAssetPreview } from "../../../components/terms/square-asset-preview";
import { useAuthedSet } from "../../../hooks/use-set";
import { useLearnContext } from "../../../stores/use-learn-store";
import { word } from "../../../utils/terms";

interface ChoiceCardProps {
  active: Question;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ active }) => {
  const session = useSession();
  const { container } = useAuthedSet();
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);
  const feedbackBank = useLearnContext((s) => s.feedbackBank);

  const [start] = React.useState(Date.now());

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

  const choose = (term: FacingTerm) => {
    const elapsed = Date.now() - start;

    if (term.id === active.term.id) {
      answerCorrectly(term.id);

      put.mutate({
        id: active.term.id,
        containerId: container.id,
        mode: "Learn",
        correctness: 1,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount,
      });

      log.info("learn.choice.correct", {
        userId: session.data?.user?.id,
        containerId: container.id,
        termId: active.term.id,
        elapsed,
      });
    } else {
      answerIncorrectly(term.id);

      put.mutate({
        id: active.term.id,
        containerId: container.id,
        mode: "Learn",
        correctness: -1,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount + 1,
      });

      log.info("learn.choice.incorrect", {
        userId: session.data?.user?.id,
        containerId: container.id,
        termId: active.term.id,
        elapsed,
      });
    }
  };

  const isCorrectTerm = (id: string) => !!answered && id === active.term.id;
  const isIncorrectTerm = (id: string) =>
    id === answered && status === "incorrect";
  const isHighlightedTerm = (id: string) =>
    isCorrectTerm(id) || isIncorrectTerm(id);

  const questionNumText = useColorModeValue("gray.800", "gray.200");
  const defaultBorder = useColorModeValue("gray.300", "gray.500");
  const buttonBorder = useColorModeValue("gray.200", "gray.600");
  const greenText = useColorModeValue("green.600", "green.200");
  const redText = useColorModeValue("red.600", "red.200");
  const greenBorder = useColorModeValue(
    "rgba(47, 133, 90, 0.2)",
    "rgba(154, 230, 180, 0.2)",
  );
  const redBorder = useColorModeValue(
    "rgba(197, 48, 48, 0.2)",
    "rgba(252, 129, 129, 0.2)",
  );
  const textColor = useColorModeValue("gray.900", "gray.50");

  const colorSchemeForTerm = (id: string) => {
    if (!answered) return "gray";

    if (isCorrectTerm(id)) return "green";
    else if (isIncorrectTerm(id)) return "red";

    return "gray";
  };
  const colorForTerm = (id: string) => {
    const scheme = colorSchemeForTerm(id);

    switch (scheme) {
      case "green":
        return greenBorder;
      case "red":
        return redBorder;
      case "gray":
        return buttonBorder;
    }
  };

  const text =
    status == "correct"
      ? remark.correct
      : status == "incorrect"
        ? remark.incorrect
        : `Choose matching ${
            active.answerMode == "Definition" ? "definition" : "term"
          }`;

  return (
    <Stack spacing="3">
      <GenericLabel
        evaluation={
          status && status !== "unknownPartial"
            ? status == "correct"
            : undefined
        }
      >
        {text}
      </GenericLabel>
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
              rounded="xl"
              pointerEvents={answered ? "none" : "auto"}
              borderWidth="2px"
              borderColor={colorForTerm(choice.id)}
              px="8"
              py="5"
              h="full"
              colorScheme={colorSchemeForTerm(choice.id)}
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
                    <Text
                      fontSize="11px"
                      lineHeight={0}
                      color={questionNumText}
                      fontFamily="heading"
                    >
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
                  color={
                    isHighlightedTerm(choice.id)
                      ? isCorrectTerm(choice.id)
                        ? greenText
                        : redText
                      : textColor
                  }
                  whiteSpace="pre-wrap"
                  overflowWrap="anywhere"
                  textAlign="start"
                  fontWeight={500}
                >
                  <ScriptFormatter>
                    {word(active.answerMode, choice, "answer")}
                  </ScriptFormatter>
                </Text>
              </Flex>
              {active.answerMode == "Definition" && choice.assetUrl && (
                <Box ml="2">
                  <SquareAssetPreview
                    rounded={8}
                    size={60}
                    src={choice.assetUrl}
                  />
                </Box>
              )}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
