import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCheck, IconCopy, IconEdit, IconLock } from "@tabler/icons-react";
import React from "react";
import { useSet } from "../../hooks/use-set";

export interface ShareSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSetModal: React.FC<ShareSetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { id, visibility } = useSet();
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.toString());

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const mutedColor = useColorModeValue("gray.700", "gray.300");
  const dividerColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      autoFocus={false}
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="8" rounded="xl">
        <Stack spacing={8}>
          {visibility !== "Private" ? (
            <Heading fontSize="4xl">Share this set</Heading>
          ) : (
            <HStack spacing={4}>
              <IconLock size={32} />
              <Heading fontSize="4xl">This set is private</Heading>
            </HStack>
          )}
          {visibility !== "Private" ? (
            <HStack spacing={4}>
              <Input
                placeholder="Title"
                variant="flushed"
                spellCheck={false}
                fontWeight={700}
                bg={primaryBg}
                color={inputColor}
                rounded="md"
                px="4"
                size="lg"
                value={window.location.toString()}
              />
              <Button
                size="lg"
                leftIcon={copied ? <IconCheck /> : <IconCopy />}
                onClick={copy}
              >
                Copy
              </Button>
            </HStack>
          ) : (
            <Stack spacing={6}>
              <Text color={mutedColor}>
                You need to unprivate this set before you can share it with
                anyone.
              </Text>
              <Divider bg={dividerColor} />
              <Flex justifyContent="end">
                <Button leftIcon={<IconEdit />} as={Link} href={`/${id}/edit`}>
                  Edit Set
                </Button>
              </Flex>
            </Stack>
          )}
        </Stack>
      </ModalContent>
    </Modal>
  );
};