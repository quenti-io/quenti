import React from "react";

import type { Term } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";

import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { AutoResizeTextarea } from "./auto-resize-textarea";

export interface EditTermModalProps {
  term: Term | null;
  isOpen: boolean;
  onClose: () => void;
  onDefinition: boolean;
}

export const EditTermModal: React.FC<EditTermModalProps> = ({
  term,
  isOpen,
  onClose,
  onDefinition,
}) => {
  const utils = api.useContext();
  const { type } = useSetFolderUnison();

  const [word, setWord] = React.useState("");
  const [definition, setDefinition] = React.useState("");

  const initialRef = React.useRef(null);

  React.useEffect(() => {
    if (!term || !isOpen) return;

    setWord(term.word);
    setDefinition(term.definition);
  }, [term, isOpen]);

  const edit = api.terms.edit.useMutation({
    async onSuccess() {
      onClose();
      if (type == "set") {
        await utils.studySets.invalidate();
      } else {
        await utils.folders.invalidate();
      }
    },
  });

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalHeader>Edit Term</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <AutoResizeTextarea
              allowTab={false}
              value={word}
              w="full"
              onChange={(e) => setWord(e.target.value)}
              variant="flushed"
              ref={!onDefinition ? initialRef : null}
            />
            <AutoResizeTextarea
              allowTab={false}
              value={definition}
              w="full"
              onChange={(e) => setDefinition(e.target.value)}
              variant="flushed"
              ref={onDefinition ? initialRef : null}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!term) return;

                edit.mutate({
                  ...term,
                  word,
                  definition,
                });
              }}
              isLoading={edit.isLoading}
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
