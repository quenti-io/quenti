import { motion } from "framer-motion";

import {
  Box,
  Card,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { ScriptFormatter } from "../../components/script-formatter";
import { useLearnContext, word } from "../../stores/use-learn-store";
import { ChoiceCard } from "./cards/choice";
import { WriteCard } from "./cards/write";

export const InteractionCard = () => {
  const timeline = useLearnContext((s) => s.roundTimeline);
  const termsThisRound = useLearnContext((s) => s.termsThisRound);
  const roundCounter = useLearnContext((s) => s.roundCounter);
  const roundProgress = useLearnContext((s) => s.roundProgress);
  const prevTermWasIncorrect = useLearnContext((s) => s.prevTermWasIncorrect);

  const chipBg = useColorModeValue("gray.200", "gray.800");

  const active = timeline[roundCounter];
  if (!active) return null;

  return (
    <motion.div
      key={active.term.id}
      initial={{ translateY: -20, opacity: 0.5 }}
      animate={{ translateY: 0, opacity: 1 }}
      style={{
        marginBottom: 100,
      }}
    >
      <Card overflow="hidden" shadow="2xl">
        <motion.div
          style={{
            overflow: "hidden",
          }}
          initial={{
            width: `calc(100% * ${Math.max(
              roundProgress - (prevTermWasIncorrect ? 0 : 1),
              0,
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
              {active.answerMode == "Definition" ? "Term" : "Definition"}
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
          <Box minH={{ base: "60px", md: "140px" }}>
            <Text fontSize="xl" whiteSpace="pre-wrap">
              <ScriptFormatter>
                {word(active.answerMode, active.term, "prompt")}
              </ScriptFormatter>
            </Text>
          </Box>
          {active.type == "choice" ? (
            <ChoiceCard active={active} />
          ) : (
            <WriteCard active={active} />
          )}
        </Stack>
      </Card>
    </motion.div>
  );
};
