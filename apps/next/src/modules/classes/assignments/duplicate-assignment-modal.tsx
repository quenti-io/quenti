import { useRouter } from "next/router";

import { Modal } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";

import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";

export interface DuplicateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DuplicateAssignmentModal: React.FC<
  DuplicateAssignmentModalProps
> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: class_ } = useClass();
  const { data: assigmment } = useAssignment();
  const utils = api.useUtils();

  const duplicate = api.assignments.duplicate.useMutation({
    onSuccess: async () => {
      onClose();
      await router.push(`/classes/${id}/assignments`);
      await utils.assignments.feed.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Stack>
            <Modal.Heading>Duplicate assignment</Modal.Heading>
            <Text>
              <strong>{assigmment?.title}</strong> will be copied to other
              sections.
            </Text>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={duplicate.isLoading}
              onClick={() => {
                duplicate.mutate({
                  classId: class_!.id,
                  id: assigmment!.id,
                  sectionIds: class_!.sections!.map((x) => x.id) || [],
                });
              }}
            >
              Duplicate
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
