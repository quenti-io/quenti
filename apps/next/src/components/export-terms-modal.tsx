import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import React, { useMemo } from "react";
import { useSet } from "../hooks/use-set";

export interface ExportTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTermsModal: React.FC<ExportTermsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { terms } = useSet();

  const [_termDelimiter, setTermDelimiter] = React.useState("\\t");
  const [_cardDelimiter, setCardDelimiter] = React.useState("\\n");
  const td = _termDelimiter.replace(/\\t/g, "\t").replace(/\\n/g, "\n");
  const cd = _cardDelimiter.replace(/\\t/g, "\t").replace(/\\n/g, "\n");

  React.useEffect(() => {
    if (isOpen) return;
    setTermDelimiter("\\t");
    setCardDelimiter("\\n");
  }, [isOpen]);

  const parseTerms = (td: string, cd: string): string => {
    return terms
      .map((term) => {
        const word = term.word.replaceAll("\n", " ");
        const definition = term.definition.replaceAll("\n", " ");

        return `${word}${td}${definition}`;
      })
      .join(cd);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(() => parseTerms(td, cd), [td, cd, terms]);

  const textareaBg = useColorModeValue("gray.100", "gray.750");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalHeader fontSize="2xl" fontWeight={700}>
          Export Terms
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6} mb="4">
            <Flex gap={4}>
              <Stack w="full">
                <Stack spacing={0}>
                  <Text fontWeight={700}>In between terms</Text>
                  <Text fontSize="sm" color={grayText}>
                    Defaults to tab
                  </Text>
                </Stack>
                <Input
                  variant="flushed"
                  placeholder="Tab"
                  value={_termDelimiter}
                  onChange={(e) => setTermDelimiter(e.target.value)}
                />
              </Stack>
              <Stack w="full">
                <Stack spacing={0}>
                  <Text fontWeight={700}>In between cards</Text>
                  <Text fontSize="sm" color={grayText}>
                    Defaults to newline
                  </Text>
                </Stack>
                <Input
                  variant="flushed"
                  placeholder="Newline"
                  value={_cardDelimiter}
                  onChange={(e) => setCardDelimiter(e.target.value)}
                />
              </Stack>
            </Flex>
            <Stack spacing={6}>
              <Textarea
                bg={textareaBg}
                height={300}
                value={result}
                resize="none"
              />
              <Flex justifyContent="end">
                <Button
                  leftIcon={copied ? <IconCheck /> : <IconCopy />}
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
