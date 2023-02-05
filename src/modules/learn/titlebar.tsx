import { Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { SetSettingsModal } from "../../components/set-settings-modal";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { useLearnContext } from "../../stores/use-learn-store";

export const Titlebar = () => {
  const { id, experience } = useSet();
  const router = useRouter();

  const studyStarred = useExperienceContext((s) => s.studyStarred);
  const answerWith = useExperienceContext((s) => s.answerWith);
  const completed = useLearnContext((s) => s.completed);
  const currentRound = useLearnContext((s) => s.currentRound);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <SetSettingsModal
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          if (
            studyStarred !== experience.studyStarred ||
            answerWith !== experience.answerWith
          ) {
            router.reload();
          }
        }}
        reloadOnReset
      />
      <Flex alignItems="center">
        <IconButton
          icon={<IconArrowLeft />}
          aria-label="Back"
          variant="ghost"
          as={Link}
          href={`/${id}`}
        />
        <Heading size="lg" textAlign="center" flex="1">
          {completed ? "Review" : `Round ${currentRound + 1}`}
        </Heading>
        <IconButton
          icon={<IconSettings />}
          aria-label="Back"
          variant="ghost"
          onClick={() => {
            setSettingsOpen(true);
          }}
        />
      </Flex>
    </>
  );
};
