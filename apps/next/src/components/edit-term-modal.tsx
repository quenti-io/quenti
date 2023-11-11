import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import { Modal } from "@quenti/components/modal";
import {
  editorInput,
  getPlainText,
  hasRichText,
  richTextToHtml,
} from "@quenti/lib/editor";
import type { Term } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Stack } from "@chakra-ui/react";

import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { RichTextBar } from "../modules/editor/card/rich-text-bar";
import { editorConfig } from "../modules/editor/editor-config";
import type { ClientTerm } from "../stores/use-set-editor-store";

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
  const utils = api.useUtils();
  const { type } = useSetFolderUnison();

  const wordEditor = useEditor({
    ...editorConfig(),
    content: term ? editorInput(term as ClientTerm, "word") : "",
  });
  const definitionEditor = useEditor({
    ...editorConfig(),
    content: term ? editorInput(term as ClientTerm, "definition") : "",
  });

  React.useEffect(() => {
    if (!term || !isOpen) return;

    wordEditor?.commands.setContent(editorInput(term as ClientTerm, "word"));
    definitionEditor?.commands.setContent(
      editorInput(term as ClientTerm, "definition"),
    );

    if (onDefinition) {
      definitionEditor?.commands.focus();
    } else {
      wordEditor?.commands.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Modal onClose={onClose} isOpen={isOpen}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit term</Modal.Heading>
          <Stack w="full">
            <RichTextBar
              activeEditor={wordEditor}
              bg="gray.100"
              _dark={{
                bg: "gray.900",
              }}
            />
            <EditorContent
              editor={wordEditor}
              onKeyDown={(e) => {
                if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                  e.stopPropagation();
              }}
            />
          </Stack>
          <Stack w="full">
            <RichTextBar
              activeEditor={definitionEditor}
              bg="gray.100"
              _dark={{
                bg: "gray.900",
              }}
            />
            <EditorContent
              editor={definitionEditor}
              onKeyDown={(e) => {
                if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                  e.stopPropagation();
              }}
            />
          </Stack>
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

                const wordJson = wordEditor!.getJSON();
                const definitionJson = definitionEditor!.getJSON();
                const word = getPlainText(wordJson);
                const definition = getPlainText(definitionJson);

                const wordRichText = hasRichText(wordJson, word);
                const definitionRichText = hasRichText(
                  definitionJson,
                  definition,
                );

                edit.mutate({
                  ...term,
                  word,
                  definition,
                  wordRichText: wordRichText
                    ? richTextToHtml(wordJson)
                    : undefined,
                  definitionRichText: definitionRichText
                    ? richTextToHtml(definitionJson)
                    : undefined,
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
