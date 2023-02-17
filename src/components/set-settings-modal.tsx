import {
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import React from "react";
import { useSet } from "../hooks/use-set";
import { useExperienceContext } from "../stores/use-experience-store";
import { AnswerModeSection } from "./set-settings-modal/answer-mode-section";
import { ExtendedFeedbackSection } from "./set-settings-modal/extended-feedback-bank-section";
import { MultipleAnswerModeSection } from "./set-settings-modal/multiple-answer-mode-section";
import { ResetProgressSection } from "./set-settings-modal/reset-progress-section";
import { StudyStarredSection } from "./set-settings-modal/study-starred-section";

export interface SetSettingsModal {
  isOpen: boolean;
  onClose: (isDirty?: boolean) => void;
  reloadOnReset?: boolean;
}

interface SetSettingsModalContextProps {
  onClose: () => void;
  reloadOnReset?: boolean;
}

export const SetSettingsModalContext =
  React.createContext<SetSettingsModalContextProps>({
    onClose: () => undefined,
    reloadOnReset: false,
  });

export const SetSettingsModal: React.FC<SetSettingsModal> = ({
  isOpen,
  onClose,
  reloadOnReset,
}) => {
  const useExtendedFeedbackBank = useFeatureIsOn("extended-feedback-bank");

  const { experience } = useSet();

  const studyStarred = useExperienceContext((s) => s.studyStarred);
  const answerWith = useExperienceContext((s) => s.answerWith);
  const multipleAnswerMode = useExperienceContext((s) => s.multipleAnswerMode);

  return (
    <SetSettingsModalContext.Provider value={{ onClose, reloadOnReset }}>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          const isDirty =
            experience.answerWith !== answerWith ||
            experience.studyStarred !== studyStarred;
          onClose(isDirty);
        }}
        isCentered
        autoFocus={false}
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent p="4" pb="8" rounded="xl">
          <ModalBody>
            <Stack spacing={6}>
              <Heading>Settings</Heading>
              <StudyStarredSection />
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
    </SetSettingsModalContext.Provider>
  );
};
