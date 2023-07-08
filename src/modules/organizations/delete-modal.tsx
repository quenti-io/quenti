import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconExclamationCircle } from "@tabler/icons-react";
import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
  isLoading?: boolean;
  onDelete: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  orgName,
  isLoading,
  onDelete,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const mutedColor = useColorModeValue("gray.700", "gray.300");
  const modalBg = useColorModeValue("white", "gray.800");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="2xl"
      initialFocusRef={cancelRef}
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent px="4" py="6" rounded="lg" bg={modalBg}>
        <ModalBody py="4">
          <Stack spacing="4">
            <HStack spacing="4">
              <Box color="red.400" w="8">
                <IconExclamationCircle size="32px" />
              </Box>
              <Heading size="lg">Delete Organization</Heading>
            </HStack>
            <HStack spacing="4">
              <Box minW="8" />
              <Text color={mutedColor}>
                Are you sure you want to delete your organization &apos;
                {orgName}&apos;? All members and students will be disbanded from
                the organization. Your billing will automatically be cancelled.{" "}
                <b>This action is irreversible.</b>
              </Text>
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
