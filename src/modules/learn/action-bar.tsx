import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";
import { api } from "../../utils/api";
import { AnyKeyPressLayer } from "./any-key-press-layer";

export const ActionBar = () => {
  const { experience } = useSet();
  const status = useLearnContext((s) => s.status);
  const roundSummary = useLearnContext((s) => s.roundSummary);
  const roundTimeline = useLearnContext((s) => s.roundTimeline);
  const roundCounter = useLearnContext((s) => s.roundCounter);
  const acknowledgeIncorrect = useLearnContext((s) => s.acknowledgeIncorrect);
  const nextRound = useLearnContext((s) => s.nextRound);

  const put = api.studiableTerms.put.useMutation();

  const handleAcknowledgeIncorrect = () => {
    acknowledgeIncorrect();

    const active = roundTimeline[roundCounter]!;
    if (active.type == "write") {
      void (async () =>
        await put.mutateAsync({
          id: active.term.id,
          experienceId: experience.id,
          correctness: -1,
          appearedInRound: active.term.appearedInRound || 0,
          incorrectCount: active.term.incorrectCount + 1,
        }))();
    }
  };

  const visible = status == "incorrect" || !!roundSummary;

  const handleAction = () => {
    status == "incorrect" ? handleAcknowledgeIncorrect() : nextRound();
  };

  const backgroundColor = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      {visible && <AnyKeyPressLayer onSubmit={handleAction} />}
      <AnimatePresence>
        {visible && (
          <motion.div
            style={{ position: "fixed", bottom: 0, width: "100%" }}
            initial={{ translateY: 80 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 80 }}
          >
            <Box w="full" bg={backgroundColor}>
              <Container maxW="4xl" py="4">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text
                    fontSize="lg"
                    color={textColor}
                    display={{ base: "none", md: "flex" }}
                  >
                    Press any key to continue
                  </Text>
                  <Button
                    size="lg"
                    w={{ base: "full", md: "auto" }}
                    onClick={handleAction}
                  >
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
