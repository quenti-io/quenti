import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { Modal } from "../../components/modal";

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
            <Button>Remove member</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
