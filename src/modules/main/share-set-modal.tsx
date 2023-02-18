import {
  Button,
  Heading,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import React from "react";

export interface ShareSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSetModal: React.FC<ShareSetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.toString());

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

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
          <Heading fontSize="4xl">Share this set</Heading>
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
        </Stack>
      </ModalContent>
    </Modal>
  );
};
