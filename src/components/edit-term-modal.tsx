import React from "react";
import { Term } from "@prisma/client";
import {
  Button,
  ButtonGroup,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { api } from "../utils/api";

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
      utils.studySets.invalidate();
      onClose();
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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Term</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <Input
              value={word}
              w="full"
              onChange={(e) => setWord(e.target.value)}
              variant="flushed"
              ref={!onDefinition ? initialRef : null}
            />
            <Input
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
