import {
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { CardsSortingSection } from "./settings/cards-sorting-section";
import { RestartFlashcardsSection } from "./settings/restart-flashcards-section";

export interface FlashcardsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardsSettingsModal: React.FC<
  FlashcardsSettingsModalProps
> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={6}>
            <Flex justifyContent="space-between">
              <Heading>Settings</Heading>
              <ModalCloseButton mr="4" mt="4" />
            </Flex>
            <CardsSortingSection />
            <Divider />
            <RestartFlashcardsSection requestClose={onClose} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
