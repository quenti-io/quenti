import {
  Button,
  ButtonGroup,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { Modal } from "./modal";

export interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const inputBg = useColorModeValue("gray.100", "gray.750");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Create a class</Modal.Heading>
          <Stack spacing="4">
            <Input
              placeholder="Title"
              variant="flushed"
              fontWeight={700}
              bg={inputBg}
              color={inputColor}
              rounded="md"
              px="4"
              size="lg"
            />
            <AutoResizeTextarea
              allowTab={false}
              placeholder="Description (optional)"
              bg={inputBg}
              color={inputColor}
              py="3"
              border="none"
            />
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button>Create</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
