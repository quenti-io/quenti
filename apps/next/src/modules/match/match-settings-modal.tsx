import { Modal } from "@quenti/components/modal";

import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../stores/use-container-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { StudyStarredSection } from "./settings/study-starred-section";

export interface MatchSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchSettingsModal: React.FC<MatchSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { container } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const matchStudyStarred = useContainerContext((s) => s.matchStudyStarred);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        const isDirty = container.matchStudyStarred !== matchStudyStarred;
        if (isDirty) setIsDirty(true);
        onClose();
      }}
      isCentered
      size="md"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Settings</Modal.Heading>
          <StudyStarredSection />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
