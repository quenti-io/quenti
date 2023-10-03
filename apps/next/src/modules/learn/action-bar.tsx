import { AnimatePresence, motion } from "framer-motion";

import { api } from "@quenti/trpc";

import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";

import { useAuthedSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";
import { AnyKeyPressLayer } from "./any-key-press-layer";

export const ActionBar = () => {
  const { container } = useAuthedSet();
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
          containerId: container.id,
          mode: "Learn",
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
            <Box
              w="full"
              bg="white"
              borderTopWidth="2px"
              borderTopColor="gray.100"
              _dark={{
                bg: "gray.800",
                borderTopColor: "gray.750",
              }}
            >
              <Container maxW="4xl" py="4">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text
                    fontSize="md"
                    color="gray.500"
                    fontWeight={500}
                    display={{ base: "none", md: "flex" }}
                  >
                    Press any key to continue
                  </Text>
                  <Button
                    w={{ base: "full", md: "auto" }}
                    onClick={handleAction}
                    fontSize="sm"
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
