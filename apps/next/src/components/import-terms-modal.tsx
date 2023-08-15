import React, { useMemo } from "react";

import {
  Button,
  ButtonGroup,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { plural } from "../utils/string";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { GenericTermCard } from "./generic-term-card";

export interface ImportTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (terms: { word: string; definition: string }[]) => void;
}

export const ImportTermsModal: React.FC<ImportTermsModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [value, setValue] = React.useState("");

  const [_termDelimiter, setTermDelimiter] = React.useState("\\t");
  const [_cardDelimiter, setCardDelimiter] = React.useState("\\n");
  const td = _termDelimiter.replace(/\\t/g, "\t").replace(/\\n/g, "\n");
  const cd = _cardDelimiter.replace(/\\t/g, "\t").replace(/\\n/g, "\n");

  const grayText = useColorModeValue("gray.600", "gray.400");

  const generatePlaceholder = () => {
    return Array.from({ length: 3 })
      .map((_, i) => `Term ${i + 1}${td}Definition ${i + 1}`)
      .join(cd);
  };

  React.useEffect(() => {
    if (isOpen) return;
    setValue("");
    setTermDelimiter("\\t");
    setCardDelimiter("\\n");
  }, [isOpen]);

  const parseTerms = (
    value: string,
    td: string,
    cd: string,
  ): { word: string; definition: string }[] => {
    return value
      .split(cd)
      .map((card) => card.split(td))
      .map(([word, definition]) => ({
        word: word || "",
        definition: definition || "",
      }))
      .filter(({ word, definition }) => word || definition);
  };

  const previewTerms = useMemo(
    () => parseTerms(value, td, cd),
    [value, td, cd],
  );

  const textareaBg = useColorModeValue("gray.100", "gray.750");

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
          Import Terms
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <Text>
              Copy and paste your terms and definitions in the following format:
            </Text>
            <AutoResizeTextarea
              bg={textareaBg}
              placeholder={generatePlaceholder()}
              minHeight="100px"
              allowTab
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
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
            <Text fontWeight={700}>
              Preview{" "}
              {!!previewTerms.length && plural(previewTerms.length, "Term")}
            </Text>
            <Stack>
              {previewTerms.map(({ word, definition }, i) => (
                <GenericTermCard
                  key={i}
                  term={{ word, definition, id: "", studySetId: "", rank: i }}
                  variantBg
                />
              ))}
              {!previewTerms.length && (
                <Text color={grayText}>Nothing to preview</Text>
              )}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!previewTerms.length}
              onClick={() => {
                onImport(previewTerms);
              }}
            >
              Import{" "}
              {!!previewTerms.length && plural(previewTerms.length, "term")}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
