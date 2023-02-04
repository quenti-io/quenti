import { Flex, IconButton } from "@chakra-ui/react";
import { IconArrowsShuffle, IconPlayerPlay } from "@tabler/icons-react";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

export const ControlsBar = () => {
  const { id, type } = useSetFolderUnison();
  const setShuffleSet = api.experience.setShuffle.useMutation();
  const setShuffleFolder = api.folders.setShuffle.useMutation();

  const [shuffle, toggle] = useExperienceContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);

  return (
    <Flex justifyContent="space-between">
      <IconButton
        icon={<IconArrowsShuffle />}
        aria-label="Shuffle"
        rounded="full"
        variant={shuffle ? "solid" : "ghost"}
        colorScheme="gray"
        onClick={() => {
          toggle();

          if (type === "set") {
            setShuffleSet.mutate({ studySetId: id, shuffle: !shuffle });
          } else {
            setShuffleFolder.mutate({ folderId: id, shuffle: !shuffle });
          }
        }}
      />
      <IconButton
        icon={<IconPlayerPlay />}
        aria-label="Shuffle"
        rounded="full"
        variant="ghost"
        colorScheme="gray"
      />
    </Flex>
  );
};
