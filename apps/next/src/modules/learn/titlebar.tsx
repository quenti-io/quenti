import React from "react";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";

import { Flex, Heading, IconButton, Skeleton } from "@chakra-ui/react";

import { IconArrowLeft, IconSettings } from "@tabler/icons-react";

import { useSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";
import { LearnSettingsModal } from "./learn-settings-modal";

export const Titlebar = () => {
  const { id, title } = useSet();

  const completed = useLearnContext((s) => s.completed);
  const currentRound = useLearnContext((s) => s.currentRound);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <HeadSeo title={`Learn: ${title}`} />
      <LearnSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        dirtyOnReset
      />
      <Flex alignItems="center">
        <IconButton
          icon={<IconArrowLeft />}
          rounded="full"
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
          rounded="full"
          aria-label="Settings"
          variant="ghost"
          onClick={() => {
            setSettingsOpen(true);
          }}
        />
      </Flex>
    </>
  );
};

Titlebar.Skeleton = function TitlebarSkeleton() {
  return (
    <Flex alignItems="center">
      <Skeleton fitContent rounded="full">
        <IconButton
          icon={<IconArrowLeft />}
          rounded="full"
          aria-label="Back"
          variant="ghost"
        />
      </Skeleton>
      <Flex flex="1" justifyContent="center">
        <Skeleton fitContent rounded="lg">
          <Heading size="lg">Round 1</Heading>
        </Skeleton>
      </Flex>
      <Skeleton fitContent rounded="full">
        <IconButton
          icon={<IconSettings />}
          rounded="full"
          aria-label="Settings"
          variant="ghost"
        />
      </Skeleton>
    </Flex>
  );
};
