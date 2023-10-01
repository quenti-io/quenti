import { motion } from "framer-motion";

import { FrameLogo, Link } from "@quenti/components";

import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  IconBooks,
  IconCloudDownload,
  IconFolder,
  IconPlus,
} from "@tabler/icons-react";

import { menuEventChannel } from "../../events/menu";

const ghost = {
  transition: {
    repeat: Infinity,
    duration: 5,
    ease: "backInOut",
  },
  animate: {
    translateY: [0, -20, 0],
  },
};
const studySet = {
  transition: {
    repeat: Infinity,
    duration: 4,
    ease: "backInOut",
    delay: 0.2,
  },
  animate: {
    translateY: [0, -20, 0],
    rotateZ: [0, -25, 0],
  },
};
const folder = {
  transition: {
    repeat: Infinity,
    duration: 4.5,
    ease: "backInOut",
    delay: 0.4,
  },
  animate: {
    translateY: [0, -20, 0],
    rotateZ: [0, 20, 0],
  },
};

export const EmptyDashboard = () => {
  return (
    <Center
      w="full"
      borderWidth="2px"
      p="12"
      rounded="3xl"
      bg="white"
      borderColor="gray.200"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.750",
      }}
      overflow="hidden"
    >
      <VStack spacing="10" position="relative" textAlign="center">
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="500px"
          bgGradient="radial(circle at center, blue.300 10%, transparent 90%)"
          className="blur-2xl"
          opacity="0.3"
          rounded="full"
          zIndex={5}
        />{" "}
        <HStack spacing="-3" opacity="0.5" position="relative" zIndex={10}>
          <motion.div {...studySet}>
            <IconBooks size={30} strokeWidth="2px" opacity="0.8" />
          </motion.div>
          <motion.div {...ghost} className="p-3">
            <FrameLogo width={20} height={20} />
          </motion.div>
          <motion.div {...folder}>
            <IconFolder size={40} strokeWidth="2px" opacity="0.9" />
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
        <VStack px="7" zIndex={10}>
          <Heading>Create your first study set</Heading>
          <Text>Start learning by creating or importing a study set.</Text>
        </VStack>
        <Stack spacing="4" zIndex={10}>
          <Button
            leftIcon={<IconPlus />}
            size="lg"
            shadow="lg"
            as={Link}
            href="/create"
            fontSize="md"
            rounded="xl"
          >
            Create a study set
          </Button>
          <Button
            leftIcon={<IconCloudDownload />}
            size="lg"
            shadow="lg"
            fontSize="md"
            rounded="xl"
            onClick={() => {
              menuEventChannel.emit("openImportDialog");
            }}
          >
            Import from Quizlet
          </Button>
        </Stack>
      </VStack>
    </Center>
  );
};
