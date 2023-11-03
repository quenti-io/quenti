import React, { useMemo } from "react";

import { Modal } from "@quenti/components/modal";

import {
  Button,
  ButtonGroup,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { ToastWrapper } from "../common/toast-wrapper";
import { useSet } from "../hooks/use-set";
import { AnimatedCheckCircle } from "./animated-icons/check";
import { Toast } from "./toast";

export interface ExportTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTermsModal: React.FC<ExportTermsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { terms } = useSet();
  const toast = useToast();

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

  const textareaBg = useColorModeValue("gray.50", "gray.750");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    onClose();

    toast({
      title: "Copied to clipboard",
      status: "success",
      colorScheme: "green",
      icon: <AnimatedCheckCircle />,
      render: Toast,
    });
  };

  return (
    <ToastWrapper>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Export terms</Modal.Heading>
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
            </Stack>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCopy}>Copy</Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ToastWrapper>
  );
};
