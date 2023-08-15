import React from "react";

import {
  Button,
  ButtonGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Modal } from "./modal";

export interface ConfirmModalProps {
  isOpen: boolean;
  body: React.ReactNode;
  isLoading?: boolean;
  heading?: string;
  actionText?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  heading,
  actionText,
  destructive,
  isLoading,
  body,
  onClose,
  onConfirm,
}) => {
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Stack spacing="2">
            <Modal.Heading>{heading || "Are you sure?"}</Modal.Heading>
            <Text color={mutedColor}>{body}</Text>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              colorScheme={destructive ? "red" : "blue"}
              variant={destructive ? "outline" : "solid"}
            >
              {actionText ?? "Confirm"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
