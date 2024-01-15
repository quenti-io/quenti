import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";

import { effectChannel } from "../../events/effects";
import { queryEventChannel } from "../../events/query";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";
import { CollabContext } from "../hydrate-collab-data";

export interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const id = useSetEditorContext((s) => s.id);
  const { submission } = React.useContext(CollabContext)!.data;

  const collab = useSetEditorContext((s) => s.collab)!;
  const submittableTerms = useSetEditorContext(
    (s) =>
      s.terms.filter(
        (x) => !!x.word.trim().length || !!x.definition.trim().length,
      ).length,
  );
  const canSubmit = submittableTerms >= collab.minTerms;

  const submit = api.collab.submit.useMutation({
    onSuccess: async ({ firstTime }) => {
      await router.push(`/${id}`);
      if (!firstTime) return;

      effectChannel.emit("prepareConfetti");

      const handler = () => {
        effectChannel.emit("confetti");
        queryEventChannel.off("setQueryRefetched", handler);
      };
      queryEventChannel.on("setQueryRefetched", handler);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Stack>
            <Modal.Heading>
              {submittableTerms >= collab.minTerms
                ? "Submit assignment"
                : "Missing terms"}
            </Modal.Heading>
            <Text>
              {canSubmit
                ? "Your terms will be submitted for everyone to see."
                : `Please fill out at least ${plural(
                    collab.minTerms,
                    "term",
                  )} to submit the assignment.`}
            </Text>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!canSubmit}
              isLoading={submit.isLoading}
              onClick={() => {
                submit.mutate({
                  submissionId: submission.id,
                });
              }}
            >
              {canSubmit
                ? `Submit ${plural(submittableTerms, "term")}`
                : "Submit"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
