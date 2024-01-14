import React from "react";

import { Modal } from "@quenti/components/modal";
import { EnabledFeature } from "@quenti/lib/feature";

import { useMediaQuery } from "@chakra-ui/react";

import { useFeature } from "../../hooks/use-feature";
import { useAuthedSet } from "../../hooks/use-set";
import { useContainerContext } from "../../stores/use-container-store";
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
  const useExtendedFeedbackBank = useFeature(
    EnabledFeature.ExtendedFeedbackBank,
  );

  const { container } = useAuthedSet();

  const shuffleLearn = useContainerContext((s) => s.shuffleLearn);
  const studyStarred = useContainerContext((s) => s.studyStarred);
  const answerWith = useContainerContext((s) => s.answerWith);
  const multipleAnswerMode = useContainerContext((s) => s.multipleAnswerMode);
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  const sm = useMediaQuery("(min-width: 768px)")[0];

  return (
    <LearnSettingsModalContext.Provider value={{ onClose, dirtyOnReset }}>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          const isDirty =
            container.shuffleLearn !== shuffleLearn ||
            container.answerWith !== answerWith ||
            container.studyStarred !== studyStarred;

          setIsDirty(isDirty);
          onClose();
        }}
        isCentered={sm}
        scrollBehavior="outside"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Settings</Modal.Heading>
            <StudyStarredSection />
            <Modal.Divider />
            <ShuffleLearnSection />
            <Modal.Divider />
            <AnswerModeSection />
            {multipleAnswerMode !== "Unknown" && (
              <>
                <Modal.Divider />
                <MultipleAnswerModeSection />
              </>
            )}
            <Modal.Divider />
            <ResetProgressSection />
            {useExtendedFeedbackBank && (
              <>
                <Modal.Divider />
                <ExtendedFeedbackSection />
              </>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </LearnSettingsModalContext.Provider>
  );
};
