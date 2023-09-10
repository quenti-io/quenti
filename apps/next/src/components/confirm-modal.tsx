import React from "react";

import { Modal } from "@quenti/components/modal";

import {
  Button,
  ButtonGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export interface ConfirmModalProps {
  isOpen: boolean;
  heading?: string;
  body: React.ReactNode;
  isLoading?: boolean;
  actionText?: string;
  destructive?: boolean;
  cancelText?: string;
  finalFocusRef?: React.RefObject<HTMLElement>;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  heading,
  body,
  isLoading,
  actionText,
  destructive,
  cancelText,
  onClose,
  onCancel,
  onConfirm,
  finalFocusRef,
}) => {
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      finalFocusRef={finalFocusRef}
    >
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
            <Button
              variant={cancelText ? "outline" : "ghost"}
              colorScheme="gray"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelText ?? "Cancel"}
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
