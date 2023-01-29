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
import { useSet } from "../../../hooks/use-set";
import type { Question } from "../../../interfaces/question";
import { useLearnContext } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";

interface ChoiceCardProps {
  active: Question;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ active }) => {
  const { experience } = useSet();
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);

  const put = api.studiableTerms.put.useMutation();

  const choose = (term: Term) => {
    if (term.id === active.term.id) {
      answerCorrectly(term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          experienceId: experience.id,
          correctness: 1,
          appearedInRound: active.term.appearedInRound,
        }))();
    } else {
      answerIncorrectly(term.id);

      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          experienceId: experience.id,
          correctness: -1,
          appearedInRound: active.term.appearedInRound,
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
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <Text fontWeight={600}>Choose matching definition</Text>
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
                  whiteSpace="normal"
                  textAlign="start"
                  fontWeight="normal"
                >
                  {choice.definition}
                </Text>
              </Flex>
            </Button>
          </GridItem>
        ))}
      </Grid>
    </>
  );
};
