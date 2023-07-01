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
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../stores/use-container-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { CardsAnswerModeSection } from "./settings/cards-answer-mode-section";
import { CardsSortingSection } from "./settings/cards-sorting-section";
import { RestartFlashcardsSection } from "./settings/restart-flashcards-section";
import { StudyStarredSection } from "./settings/study-starred-section";

export interface FlashcardsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardsSettingsModal: React.FC<
  FlashcardsSettingsModalProps
> = ({ isOpen, onClose }) => {
  const { container } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const cardsStudyStarred = useContainerContext((s) => s.cardsStudyStarred);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        const isDirty = container?.cardsStudyStarred !== cardsStudyStarred;
        if (isDirty) setIsDirty(true);

        onClose();
      }}
      isCentered
      size="xl"
    >
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
            <CardsAnswerModeSection />
            <StudyStarredSection />
            <Divider />
            <RestartFlashcardsSection requestClose={onClose} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
