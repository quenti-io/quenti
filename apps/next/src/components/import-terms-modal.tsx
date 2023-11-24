import React, { useMemo } from "react";

import { Modal } from "@quenti/components/modal";

import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
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

  const textareaBg = useColorModeValue("gray.100", "gray.900");

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="3xl" scrollBehavior="inside">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Import terms</Modal.Heading>
          <Stack spacing={6}>
            <FormControl>
              <FormLabel mb="3">
                Copy and paste your terms and definitions in the following
                format:
              </FormLabel>
              <AutoResizeTextarea
                bg={textareaBg}
                placeholder={generatePlaceholder()}
                minHeight="100px"
                rounded="lg"
                allowTab
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </FormControl>
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
              {!!previewTerms.length && plural(previewTerms.length, "term")}
            </Text>
            <Stack>
              {previewTerms.map(({ word, definition }, i) => (
                <GenericTermCard
                  key={i}
                  term={{
                    word,
                    definition,
                    wordRichText: null,
                    definitionRichText: null,
                    assetUrl: null,
                    id: "",
                    studySetId: "",
                    rank: i,
                  }}
                  variantBg
                />
              ))}
              {!previewTerms.length && (
                <Text color={grayText}>Nothing to preview</Text>
              )}
            </Stack>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
