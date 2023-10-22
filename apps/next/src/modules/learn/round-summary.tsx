import { motion } from "framer-motion";

import { Box, HStack, Heading, Stack } from "@chakra-ui/react";

import { IconKeyframes } from "@tabler/icons-react";

import { useLearnContext } from "../../stores/use-learn-store";
import { DisplayableTermPure } from "../main/displayable-term";
import { TermMastery } from "./term-mastery";

export const RoundSummary = () => {
  const roundSummary = useLearnContext((s) => s.roundSummary)!;
  const progressPercent = roundSummary.progress / roundSummary.totalTerms;

  return (
    <Stack spacing={12}>
      <Stack spacing={6}>
        <HStack>
          <Heading size="lg">
            {roundSummary.progress} / {roundSummary.totalTerms}
          </Heading>
          <Heading size="md">terms</Heading>
        </HStack>
        <Box
          h="1"
          w="full"
          rounded="full"
          bg="gray.200"
          _dark={{
            bg: "gray.750",
          }}
          overflow="hidden"
        >
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
        <HStack>
          <IconKeyframes size={18} />
          <Heading size="md">Terms studied this round</Heading>
        </HStack>
        <Stack spacing="14px">
          {roundSummary?.termsThisRound.map((term) => (
            <DisplayableTermPure term={term} key={term.id} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
