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
} from "@chakra-ui/react";
import React from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  body: React.ReactNode;
  isLoading?: boolean;
  heading?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  heading,
  isLoading,
  body,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalHeader fontSize="2xl">{heading || "Are you sure?"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} isLoading={isLoading}>
              Confirm
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
