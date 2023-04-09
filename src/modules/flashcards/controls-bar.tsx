import { Flex, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import {
  IconArrowsShuffle,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../stores/use-experience-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { api } from "../../utils/api";

interface ControlsBarProps {
  onSettingsClick: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  onSettingsClick,
}) => {
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const enableCardsSorting = useExperienceContext((s) => s.enableCardsSorting);

  const { id, type } = useSetFolderUnison();
  const setShuffleSet = api.experience.setShuffle.useMutation({
    onSuccess: () => {
      if (enableCardsSorting) setIsDirty(true);
    },
  });
  const setShuffleFolder = api.folders.setShuffle.useMutation({
    onSuccess: () => {
      if (enableCardsSorting) setIsDirty(true);
    },
  });

  const [shuffle, toggleShuffle] = useExperienceContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);
  const [autoplay, toggleAutoplay] = useExperienceContext((s) => [
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
            isLoading={
              enableCardsSorting &&
              (setShuffleSet.isLoading || setShuffleFolder.isLoading)
            }
            onClick={() => {
              toggleShuffle();

              if (type === "set") {
                setShuffleSet.mutate({ studySetId: id, shuffle: !shuffle });
              } else {
                setShuffleFolder.mutate({ folderId: id, shuffle: !shuffle });
              }
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
