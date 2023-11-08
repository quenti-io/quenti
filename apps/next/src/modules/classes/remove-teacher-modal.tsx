import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Text,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconUserX } from "@tabler/icons-react";

import { useClass } from "../../hooks/use-class";

export interface RemoveTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: {
    id: string;
    nameOrEmail: string;
    type: "member" | "invite";
  };
}

export const RemoveTeacherModal: React.FC<RemoveTeacherModalProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const { data: class_ } = useClass();
  const utils = api.useUtils();

  const removeMembers = api.classes.removeMembers.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      onClose();
    },
  });

  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>
            Remove {member?.type === "invite" ? "invite" : "teacher"}
          </Modal.Heading>
          <Text color={muted}>
            <chakra.strong fontWeight={600}>
              {member?.nameOrEmail}
            </chakra.strong>{" "}
            will no longer be able to access or modify this class until they are
            reinvited.
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<IconUserX size={18} />}
              isLoading={removeMembers.isLoading}
              onClick={() =>
                removeMembers.mutate({
                  id: class_!.id,
                  members: [member!.id],
                  type: member!.type,
                })
              }
            >
              Remove {member?.type === "invite" ? "invite" : "teacher"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
