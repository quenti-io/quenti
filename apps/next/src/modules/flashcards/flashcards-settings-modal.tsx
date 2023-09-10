import { useSession } from "next-auth/react";

import { Modal } from "@quenti/components/modal";

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
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Settings</Modal.Heading>
          <CardsSortingSection />
          <Modal.Divider />
          <CardsAnswerModeSection />
          <StudyStarredSection />
        </Modal.Body>
        <Authed>
          <Modal.Divider />
          <Modal.Footer>
            <RestartFlashcardsSection requestClose={onClose} />
          </Modal.Footer>
        </Authed>
      </Modal.Content>
    </Modal>
  );
};
