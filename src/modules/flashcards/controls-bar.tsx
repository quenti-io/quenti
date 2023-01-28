import { Flex, IconButton } from "@chakra-ui/react";
import { IconArrowsShuffle, IconPlayerPlay } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

export const ControlsBar = () => {
  const { id } = useSet();
  const setShuffle = api.experience.setShuffle.useMutation();

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
          setShuffle.mutate({ studySetId: id, shuffle: !shuffle });
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
