import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack
} from "@chakra-ui/react";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../stores/use-experience-store";
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
  const { experience } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const matchStudyStarred = useExperienceContext((s) => s.matchStudyStarred);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        const isDirty = experience.matchStudyStarred !== matchStudyStarred;
        if (isDirty) setIsDirty(true);
        onClose();
      }}
      isCentered
    >
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
