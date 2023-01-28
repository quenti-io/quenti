import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import { motion } from "framer-motion";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { AnimatedXCircle } from "../../components/animated-icons/x";
import { ChoiceShortcutLayer } from "../../components/choice-shortcut-layer";
import { useLearnContext } from "../../stores/use-learn-store";

export const InteractionCard = () => {
  const timeline = useLearnContext((s) => s.roundTimeline);
  const termsThisRound = useLearnContext((s) => s.termsThisRound);
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const roundCounter = useLearnContext((s) => s.roundCounter);
  const roundProgress = useLearnContext((s) => s.roundProgress);
  const prevTermWasIncorrect = useLearnContext((s) => s.prevTermWasIncorrect);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);

  const chipBg = useColorModeValue("gray.200", "gray.800");
  const questionNumText = useColorModeValue("gray.800", "gray.200");
  const defaultBorder = useColorModeValue("blue.600", "blue.200");
  const correctBg = useColorModeValue("green.200", "green.600");
  const textColor = useColorModeValue("black", "white");

  const active = timeline[roundCounter];
  if (!active) return null;

  const choose = (term: Term) => {
    if (term.id === active.term.id) {
      answerCorrectly(term.id);
    } else {
      answerIncorrectly(term.id);
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

  return (
    <motion.div
      key={active.term.id}
      initial={{ translateY: -20, opacity: 0.5 }}
      animate={{ translateY: 0, opacity: 1 }}
    >
      <Card overflow="hidden" shadow="2xl">
        <motion.div
          style={{
            overflow: "hidden",
          }}
          initial={{
            width: `calc(100% * ${Math.max(
              roundProgress - (prevTermWasIncorrect ? 0 : 1),
              0
            )} / ${termsThisRound})`,
          }}
          animate={{
            width: `calc(100% * ${roundProgress} / ${termsThisRound})`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <Box height="1" w="full" bg="orange.300" />
        </motion.div>
        <Stack spacing={6} px="8" py="6">
          <HStack>
            <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
              Term
            </Text>
            <Box
              bg={chipBg}
              py="1"
              px="3"
              rounded="full"
              visibility={active.term.correctness < 0 ? "visible" : "hidden"}
            >
              <Text fontSize="sm" fontWeight={600}>
                Let&apos;s try again
              </Text>
            </Box>
          </HStack>
          <Box h={140}>
            <Text fontSize="xl">{active.term.word}</Text>
          </Box>
          <Stack spacing={4}>
            <Text fontWeight={600}>Choose matching definition</Text>
          </Stack>
          <Grid gridTemplateColumns="1fr 1fr" gap="6">
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
                        <Text
                          fontSize="xs"
                          lineHeight={0}
                          color={questionNumText}
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
        </Stack>
      </Card>
    </motion.div>
  );
};
