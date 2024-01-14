import { useSession } from "next-auth/react";

import { api } from "@quenti/trpc";

import { Flex, HStack, IconButton, Skeleton, Tooltip } from "@chakra-ui/react";

import {
  IconArrowsShuffle,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";

import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../stores/use-container-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";

interface ControlsBarProps {
  onSettingsClick: () => void;
}

export const ControlsBar = ({ onSettingsClick }: ControlsBarProps) => {
  const authed = useSession().status == "authenticated";
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const enableCardsSorting = useContainerContext((s) => s.enableCardsSorting);

  const { id, entityType } = useSetFolderUnison();
  const setShuffle = api.container.setShuffle.useMutation({
    onSuccess: () => {
      if (enableCardsSorting) setIsDirty(true);
    },
  });

  const [shuffle, toggleShuffle] = useContainerContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);
  const [autoplay, toggleAutoplay] = useContainerContext((s) => [
    s.autoplayFlashcards,
    s.toggleAutoplayFlashcards,
  ]);

  return (
    <Flex justifyContent="space-between">
      <HStack spacing={4}>
        <Tooltip label="Shuffle">
          <IconButton
            icon={<IconArrowsShuffle />}
            aria-label="Shuffle"
            rounded="full"
            variant={shuffle ? "solid" : "ghost"}
            colorScheme="gray"
            isLoading={enableCardsSorting && setShuffle.isLoading}
            onClick={() => {
              toggleShuffle();

              if (authed)
                setShuffle.mutate({
                  entityId: id,
                  type: entityType == "set" ? "StudySet" : "Folder",
                  shuffle: !shuffle,
                });
            }}
          />
        </Tooltip>
        <Tooltip label="Autoplay">
          <IconButton
            icon={<IconPlayerPlay />}
            aria-label="Shuffle"
            rounded="full"
            variant={autoplay ? "solid" : "ghost"}
            colorScheme="gray"
            onClick={toggleAutoplay}
            isDisabled={enableCardsSorting}
          />
        </Tooltip>
      </HStack>
      <IconButton
        icon={<IconSettings />}
        aria-label="Setings"
        rounded="full"
        colorScheme="gray"
        variant="ghost"
        onClick={onSettingsClick}
      />
    </Flex>
  );
};

ControlsBar.Skeleton = function ControlsBarSkeleton() {
  return (
    <Flex justifyContent="space-between">
      <HStack spacing={4}>
        <Skeleton rounded="full" fitContent>
          <IconButton
            icon={<IconArrowsShuffle />}
            aria-label="Shuffle"
            rounded="full"
          />
        </Skeleton>
        <Skeleton rounded="full" fitContent>
          <IconButton
            icon={<IconPlayerPlay />}
            aria-label="Shuffle"
            rounded="full"
          />
        </Skeleton>
      </HStack>
      <Skeleton rounded="full" fitContent>
        <IconButton
          icon={<IconSettings />}
          aria-label="Setings"
          rounded="full"
        />
      </Skeleton>
    </Flex>
  );
};
