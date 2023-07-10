import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { Modal } from "../../components/modal";
import { useOrganization } from "../../hooks/use-organization";
import { api } from "../../utils/api";

export interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const org = useOrganization();
  const utils = api.useContext();
  const removeMember = api.organizations.removeMember.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.get.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Remove member</Modal.Heading>
          <Text>
            Are you sure you want to remove this member from the organization?
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={removeMember.isLoading}
              onClick={() =>
                removeMember.mutate({
                  orgId: org!.id,
                  userId: id,
                })
              }
            >
              Remove member
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
