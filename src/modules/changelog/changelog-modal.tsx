import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const session = useSession();
  const imageSrc = `/assets/changelog/flashcards-upgrade-${useColorModeValue(
    "light",
    "dark"
  )}.png`;
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" py="6" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Stack spacing={1}>
              <Flex justifyContent="space-between">
                <Heading size="2xl">What&apos;s New</Heading>
                <ModalCloseButton mr="4" mt="4" />
              </Flex>
              <Text fontSize="md" color={mutedColor} fontWeight={600}>
                Version {session.data?.version}
              </Text>
            </Stack>
            <Box
              rounded="xl"
              overflow="hidden"
              shadow="xl"
              p="4px"
              position="relative"
            >
              <Box
                w="full"
                h="full"
                bg="linear-gradient(to right, #ffa54c, #4b83ff)"
                position="absolute"
                top="0"
                left="0"
              />
              <Box
                rounded="lg"
                overflow="hidden"
                zIndex={20}
                position="relative"
                bg={useColorModeValue("gray.50", "gray.900")}
              >
                <Image
                  style={{ objectFit: "contain" }}
                  width="1200"
                  height="800"
                  src={imageSrc}
                  alt="Flashcards upgrade screenshot"
                />
              </Box>
            </Box>
            <Stack spacing={4}>
              <Heading size="lg">Flashcards Just Got an Upgrade</Heading>
              <Text>
                Now, you can review your flashcards by sorting the ones you
                know. Try this out by turning on <b>Sort Flashcards</b> in the
                new settings. Like Learn, everything&apos;s completely
                customizable—and, more importantly, free!
              </Text>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
