import {
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Authed } from "../../components/authed";
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
  const { status } = useSession();
  const { container } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const cardsStudyStarred = useContainerContext((s) => s.cardsStudyStarred);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        const isDirty = container?.cardsStudyStarred !== cardsStudyStarred;
        if (status == "authenticated" && isDirty) setIsDirty(true);

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
            <Authed>
              <Divider />
              <RestartFlashcardsSection requestClose={onClose} />
            </Authed>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
