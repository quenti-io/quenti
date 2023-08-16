import { motion } from "framer-motion";

import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";

import { GenericTermCard } from "../../components/generic-term-card";
import { useLearnContext } from "../../stores/use-learn-store";
import { TermMastery } from "./term-mastery";

export const RoundSummary = () => {
  const roundSummary = useLearnContext((s) => s.roundSummary)!;
  const progressPercent = roundSummary.progress / roundSummary.totalTerms;

  const bgColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Stack spacing={12}>
      <Stack spacing={6}>
        <Heading size="md">
          {roundSummary.progress} / {roundSummary.totalTerms} terms
        </Heading>
        <Box h="2" w="full" rounded="full" bg={bgColor} overflow="hidden">
          <motion.div
            style={{
              height: "100%",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent * 100}%` }}
            transition={{
              duration: 1,
              stiffness: 0,
              delay: 0.5,
              mass: 100,
            }}
          >
            <Box w="full" h="full" bg="blue.300" />
          </motion.div>
        </Box>
      </Stack>
      <TermMastery />
      <Stack spacing={6} pb="32">
        <Heading size="lg">Terms studied this round</Heading>
        <Stack spacing="14px">
          {roundSummary?.termsThisRound.map((term) => (
            <GenericTermCard term={term} key={term.id} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
