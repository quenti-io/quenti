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
import React from "react";
import { useFeature } from "../../hooks/use-feature";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { AnswerModeSection } from "./settings/answer-mode-section";
import { ExtendedFeedbackSection } from "./settings/extended-feedback-bank-section";
import { MultipleAnswerModeSection } from "./settings/multiple-answer-mode-section";
import { ResetProgressSection } from "./settings/reset-progress-section";
import { ShuffleLearnSection } from "./settings/shuffle-learn-section";
import { StudyStarredSection } from "./settings/study-starred-section";

export interface LearnSettingsModal {
  isOpen: boolean;
  onClose: () => void;
  dirtyOnReset?: boolean;
}

interface LearnSettingsModalContextProps {
  onClose: () => void;
  dirtyOnReset?: boolean;
}

export const LearnSettingsModalContext =
  React.createContext<LearnSettingsModalContextProps>({
    onClose: () => undefined,
    dirtyOnReset: false,
  });

export const LearnSettingsModal: React.FC<LearnSettingsModal> = ({
  isOpen,
  onClose,
  dirtyOnReset,
}) => {
  const useExtendedFeedbackBank = useFeature("ExtendedFeedbackBank");

  const { experience } = useSet();

  const shuffleLearn = useExperienceContext((s) => s.shuffleLearn);
  const studyStarred = useExperienceContext((s) => s.studyStarred);
  const answerWith = useExperienceContext((s) => s.answerWith);
  const multipleAnswerMode = useExperienceContext((s) => s.multipleAnswerMode);
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  return (
    <LearnSettingsModalContext.Provider value={{ onClose, dirtyOnReset }}>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          const isDirty =
            experience.shuffleLearn !== shuffleLearn ||
            experience.answerWith !== answerWith ||
            experience.studyStarred !== studyStarred;

          setIsDirty(isDirty);
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
              <StudyStarredSection />
              <Divider />
              <ShuffleLearnSection />
              <Divider />
              <AnswerModeSection />
              {multipleAnswerMode !== "Unknown" && (
                <>
                  <Divider />
                  <MultipleAnswerModeSection />
                </>
              )}
              <Divider />
              <ResetProgressSection />
              {useExtendedFeedbackBank && (
                <>
                  <Divider />
                  <ExtendedFeedbackSection />
                </>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </LearnSettingsModalContext.Provider>
  );
};
