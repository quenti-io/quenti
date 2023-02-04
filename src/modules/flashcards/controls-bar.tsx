import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { IconArrowsShuffle, IconPlayerPlay } from "@tabler/icons-react";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

export const ControlsBar = () => {
  const { id, type } = useSetFolderUnison();
  const setShuffleSet = api.experience.setShuffle.useMutation();
  const setShuffleFolder = api.folders.setShuffle.useMutation();

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
      <Tooltip label="Shuffle">
        <IconButton
          icon={<IconArrowsShuffle />}
          aria-label="Shuffle"
          rounded="full"
          variant={shuffle ? "solid" : "ghost"}
          colorScheme="gray"
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
    </Flex>
  );
};
