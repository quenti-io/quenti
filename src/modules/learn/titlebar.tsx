import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { SetSettingsModal } from "../../components/set-settings-modal";
import { useSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";

export const Titlebar = () => {
  const { id } = useSet();

  const completed = useLearnContext((s) => s.completed);
  const currentRound = useLearnContext((s) => s.currentRound);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <SetSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        dirtyOnReset
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
