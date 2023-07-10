import { Button, ButtonGroup, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Modal } from "../../components/modal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onDelete: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onDelete,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Delete organization</Modal.Heading>
          <Text color={mutedColor}>
            Are you sure you want to delete your organization? All members and
            students will be disbanded from the organization. Your billing will
            automatically be cancelled. <b>This action is irreversible.</b>
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button onClick={onClose} ref={cancelRef}>
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              isLoading={isLoading}
              colorScheme="red"
              variant="ghost"
            >
              Yes, delete organization
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
