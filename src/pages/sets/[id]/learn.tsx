import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Progress,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { useLearnContext } from "../../../stores/use-learn-store";
import { AnimatePresence, motion } from "framer-motion";
import { Term } from "@prisma/client";
import { useShortcut } from "../../../hooks/use-shortcut";
import { ChoiceShortcutLayer } from "../../../components/choice-shortcut-layer";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";

export default function Learn() {
  return (
    <HydrateSetData>
      <CreateLearnData>
        <Container maxW="4xl">
          <Stack spacing={8}>
            <Titlebar />
            <LearnContainer />
          </Stack>
        </Container>
        <ActionBar />
      </CreateLearnData>
    </HydrateSetData>
  );
}

const Titlebar = () => {
  const currentRound = useLearnContext((s) => s.currentRound);

  return (
    <Heading size="lg" textAlign="center">
      Round {currentRound + 1}
    </Heading>
  );
};

const LearnContainer = () => {
  const roundSummary = useLearnContext((s) => s.roundSummary);

  if (roundSummary) return <RoundSummary />;
  else return <InteractionCard />;
};

const InteractionCard = () => {
  const timeline = useLearnContext((s) => s.roundTimeline);
  const termsThisRound = useLearnContext((s) => s.termsThisRound);
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const roundCounter = useLearnContext((s) => s.roundCounter);
  const roundProgress = useLearnContext((s) => s.roundProgress);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);

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

  const colorModeValue = (color: string) =>
    useColorModeValue(`${color}.600`, `${color}.200`);

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
              roundProgress - 1,
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
              bg={useColorModeValue("gray.200", "gray.800")}
              py="1"
              px="3"
              rounded="full"
              visibility={active.term.correctness < 0 ? "visible" : "hidden"}
            >
              <Text fontSize="sm" fontWeight={600}>
                Let's try again
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
              <GridItem h="auto">
                <Button
                  w="full"
                  variant="outline"
                  pointerEvents={answered ? "none" : "auto"}
                  bg={
                    isCorrectTerm(choice.id)
                      ? useColorModeValue("green.200", "green.600")
                      : "transparent"
                  }
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
                        borderColor={colorModeValue(colorForTerm("blue"))}
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
                          color={useColorModeValue("gray.800", "gray.200")}
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
                      color={useColorModeValue("black", "white")}
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

export const RoundSummary = () => {
  const roundSummary = useLearnContext((s) => s.roundSummary);

  return (
    <>
      <Heading size="md">
        {roundSummary?.progress} / {roundSummary?.totalTerms} terms
      </Heading>
      <Box
        h="2"
        w="full"
        rounded="full"
        bg={useColorModeValue("gray.300", "gray.700")}
        overflow="hidden"
      >
        <motion.div
          style={{
            height: "100%",
          }}
          initial={{ width: 0 }}
          animate={{ width: "20%" }}
          transition={{
            duration: 1,
            stiffness: 0,
            delay: 0.5,
            mass: 100,
          }}
        >
          <Box
            w="full"
            h="full"
            bg={useColorModeValue("blue.600", "blue.300")}
          />
        </motion.div>
      </Box>
    </>
  );
};

const ActionBar = () => {
  const status = useLearnContext((s) => s.status);
  const roundSummary = useLearnContext((s) => s.roundSummary);
  const acknowledgeIncorrect = useLearnContext((s) => s.acknowledgeIncorrect);
  const nextRound = useLearnContext((s) => s.nextRound);

  const visible = status == "incorrect" || !!roundSummary;
  const action = status == "incorrect" ? acknowledgeIncorrect : nextRound;

  return (
    <>
      {visible && <AnyKeyPressLayer onSubmit={action} />}
      <AnimatePresence>
        {visible && (
          <motion.div
            style={{ position: "fixed", bottom: 0, width: "100%" }}
            initial={{ translateY: 80 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 80 }}
          >
            <Box w="full" bg={useColorModeValue("gray.200", "gray.800")}>
              <Container maxW="4xl" py="4">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.600", "gray.400")}
                  >
                    Press any key to continue
                  </Text>
                  <Button size="lg" onClick={action}>
                    Continue
                    {roundSummary && ` to round ${roundSummary.round + 2}`}
                  </Button>
                </Flex>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AnyKeyPressLayer = ({ onSubmit }: { onSubmit: () => void }) => {
  useShortcut([], onSubmit, false, false, false, true);
  return null;
};

export { getServerSideProps } from "../../../components/chakra";
