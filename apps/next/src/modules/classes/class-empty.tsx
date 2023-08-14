import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { IconGhost3 } from "@tabler/icons-react";
import { motion } from "framer-motion";

const mainGhost = {
  transition: {
    repeat: Infinity,
    duration: 5,
    ease: "backInOut",
  },
  animate: {
    translateY: [0, -20, 0],
  },
};
const leftGhost = {
  transition: {
    repeat: Infinity,
    duration: 4,
    ease: "backInOut",
    delay: 0.2,
  },
  animate: {
    translateY: [0, -20, 0],
  },
};
const rightGhost = {
  transition: {
    repeat: Infinity,
    duration: 4.5,
    ease: "backInOut",
    delay: 0.4,
  },
  animate: {
    translateY: [0, -20, 0],
  },
};

export const ClassEmpty = () => {
  return (
    <VStack color="gray.700" _dark={{ color: "gray.300" }} spacing="4" mt="10">
      <HStack spacing="-3" opacity="0.5" position="relative">
        <motion.div {...leftGhost}>
          <IconGhost3 size={30} strokeWidth="3px" opacity="0.8" />
        </motion.div>
        <motion.div {...mainGhost}>
          <IconGhost3 size={100} strokeWidth="2px" />
        </motion.div>
        <motion.div {...rightGhost}>
          <IconGhost3 size={40} strokeWidth="3px" opacity="0.9" />
        </motion.div>
        <Box
          position="absolute"
          top="10"
          left="0"
          w="full"
          h="full"
          zIndex={-1}
          bgGradient="linear(to-b, gray.500, transparent)"
          opacity="0.5"
          rounded="full"
        />
      </HStack>
      <Heading color="gray.500">Nothing yet</Heading>
      <Text fontSize="sm" color="gray.500" fontWeight={500}>
        Check back here once your teacher adds some content to the class.
      </Text>
    </VStack>
  );
};
