import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AutoResizeTextarea } from "./auto-resize-textarea";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const secondaryBg = useColorModeValue("gray.100", "gray.750");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p="4" rounded="xl">
        <ModalHeader fontWeight={700} fontSize="3xl">
          Create Folder
        </ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Input
              placeholder="Title"
              variant="flushed"
              fontWeight={700}
              bg={primaryBg}
              rounded="md"
              px="4"
              size="lg"
            />
            <AutoResizeTextarea
              allowTab={false}
              placeholder="Description (optional)"
              bg={secondaryBg}
              py="4"
              border="none"
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap={2}>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button>Create</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
