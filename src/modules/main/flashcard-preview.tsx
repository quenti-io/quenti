import { Button, Flex, IconButton, Link, Stack } from "@chakra-ui/react";
import {
  IconArrowsMaximize,
  IconArrowsShuffle,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";
import React from "react";
import { FlashcardWrapper } from "../../components/flashcard-wrapper";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

export const FlashcardPreview = () => {
  const data = useSet();

  const setShuffle = api.experience.setShuffle.useMutation();

  const [shuffle, toggle] = useExperienceContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(data.termOrder)) : data.termOrder
  );

  React.useEffect(() => {
    setTermOrder(
      shuffle ? shuffleArray(Array.from(data.termOrder)) : data.termOrder
    );
  }, [shuffle, data.termOrder]);

  return (
    <Flex
      gap={8}
      flexDir={{ base: "column", md: "row" }}
      alignItems="stretch"
      w="full"
    >
      <Flex maxW="1000px" flex="1">
        <FlashcardWrapper terms={data.terms} termOrder={termOrder} />
      </Flex>
      <Flex flexDir="column" justifyContent="space-between">
        <Stack spacing={4}>
          <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
            <Button
              w="full"
              leftIcon={<IconArrowsShuffle />}
              variant={shuffle ? "solid" : "outline"}
              onClick={() => {
                toggle();
                setShuffle.mutate({ studySetId: data.id, shuffle: !shuffle });
              }}
            >
              Shuffle
            </Button>
            <Button leftIcon={<IconPlayerPlay />} variant="outline" w="full">
              Autoplay
            </Button>
          </Stack>
          <Button
            leftIcon={<IconSettings />}
            variant="ghost"
            display={{ base: "none", md: "flex" }}
          >
            Settings
          </Button>
        </Stack>
        <Flex justifyContent={{ base: "end", md: "start" }} marginTop="4">
          <IconButton
            w="max"
            icon={<IconSettings />}
            rounded="full"
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            aria-label="Settings"
            colorScheme="gray"
          />
          <IconButton
            w="max"
            rounded="full"
            variant="ghost"
            as={Link}
            href={`/${data.id}/flashcards`}
            icon={<IconArrowsMaximize />}
            aria-label="Full screen"
            colorScheme="gray"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
