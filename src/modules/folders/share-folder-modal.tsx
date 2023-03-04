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
import { env } from "../../env/client.mjs";
import { useFolder } from "../../hooks/use-folder";
import { api } from "../../utils/api";

export interface ShareFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareFolderModal: React.FC<ShareFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { id } = useFolder();
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const getShareId = api.folders.getShareId.useQuery(id, {
    enabled: isOpen,
  });
  const url = `${env.NEXT_PUBLIC_BASE_URL}/_${getShareId.data || ""}`;

  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(url);

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
          <Heading fontSize="4xl">Share this folder</Heading>
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
              value={getShareId.isLoading ? "Loading..." : url}
            />
            <Button
              size="lg"
              leftIcon={copied ? <IconCheck /> : <IconCopy />}
              onClick={copy}
              isLoading={getShareId.isLoading}
            >
              Copy
            </Button>
          </HStack>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
