import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { StudyStarredSection } from "./settings/study-starred-section";

export interface MatchSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchSettingsModal: React.FC<MatchSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={6}>
            <Flex justifyContent="space-between">
              <Heading>Settings</Heading>
              <ModalCloseButton mr="4" mt="4" />
            </Flex>
            <StudyStarredSection />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
