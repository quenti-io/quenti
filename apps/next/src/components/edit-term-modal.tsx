import React from "react";

import { Modal } from "@quenti/components/modal";
import type { Term } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup } from "@chakra-ui/react";

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
    <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={initialRef}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit term</Modal.Heading>
          <AutoResizeTextarea
            allowTab={false}
            value={word}
            w="full"
            onChange={(e) => setWord(e.target.value)}
            ref={!onDefinition ? initialRef : null}
          />
          <AutoResizeTextarea
            allowTab={false}
            value={definition}
            w="full"
            onChange={(e) => setDefinition(e.target.value)}
            ref={onDefinition ? initialRef : null}
          />
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
