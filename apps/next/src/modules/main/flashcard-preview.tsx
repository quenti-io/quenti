import {
  Box,
  Button,
  Flex,
  IconButton,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import {
  IconArrowsShuffle,
  IconMaximize,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { LoadingFlashcard } from "../../components/loading-flashcard";
import { RootFlashcardWrapper } from "../../components/root-flashcard-wrapper";
import { useSet } from "../../hooks/use-set";
import { FlashcardsSettingsModal } from "../flashcards/flashcards-settings-modal";
import { useContainerContext } from "../../stores/use-container-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { api } from "@quenti/trpc";
import { shuffleArray } from "@quenti/lib/array";

export const FlashcardPreview = () => {
  const data = useSet();
  const enableCardsSorting = useContainerContext((s) => s.enableCardsSorting);
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  const apiSetShuffle = api.container.setShuffle.useMutation({
    onSuccess: () => {
      if (enableCardsSorting) {
        setIsDirty(true);
      }
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

  const _termOrder = data.terms
    .sort((a, b) => a.rank - b.rank)
    .map((t) => t.id);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder
  );

  React.useEffect(() => {
    setTermOrder(shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle]);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <FlashcardsSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Flex
        gap={8}
        flexDir={{ base: "column", md: "row" }}
        alignItems="stretch"
        w="full"
      >
        <Flex maxW="1000px" flex="1">
          <Box w="full">
            <RootFlashcardWrapper terms={data.terms} termOrder={termOrder} />
          </Box>
        </Flex>
        <Flex flexDir="column" justifyContent="space-between">
          <Stack spacing={4}>
            <Stack
              direction={{ base: "row", md: "column" }}
              w="full"
              spacing={4}
            >
              <Button
                w="full"
                leftIcon={<IconArrowsShuffle />}
                variant={shuffle ? "solid" : "outline"}
                onClick={() => {
                  void (async () => {
                    await apiSetShuffle.mutateAsync({
                      entityId: data.id,
                      shuffle: !shuffle,
                      type: "StudySet",
                    });
                  })();

                  toggleShuffle();
                }}
                isLoading={enableCardsSorting && apiSetShuffle.isLoading}
              >
                Shuffle
              </Button>
              <Button
                leftIcon={<IconPlayerPlay />}
                variant={autoplay ? "solid" : "outline"}
                w="full"
                onClick={toggleAutoplay}
                isDisabled={enableCardsSorting}
              >
                Autoplay
              </Button>
            </Stack>
            <Button
              leftIcon={<IconSettings />}
              variant="ghost"
              display={{ base: "none", md: "flex" }}
              onClick={() => setSettingsOpen(true)}
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
              onClick={() => setSettingsOpen(true)}
            />

            <IconButton
              w="max"
              rounded="full"
              variant="ghost"
              as={Link}
              href={`/${data.id}/flashcards`}
              icon={<IconMaximize />}
              aria-label="Full screen"
              colorScheme="gray"
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

FlashcardPreview.Skeleton = function FlashcardPreviewSkeleton() {
  return (
    <Flex
      gap={8}
      flexDir={{ base: "column", md: "row" }}
      alignItems="stretch"
      w="full"
    >
      <Flex maxW="1000px" flex="1">
        <Box w="full">
          <LoadingFlashcard h="500px" />
        </Box>
      </Flex>
      <Flex flexDir="column" justifyContent="space-between">
        <Stack spacing={4}>
          <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
            <Skeleton w="full" rounded="md">
              <Button w="full" leftIcon={<IconArrowsShuffle />}>
                Shuffle
              </Button>
            </Skeleton>
            <Skeleton w="full" rounded="md">
              <Button w="full" leftIcon={<IconPlayerPlay />}>
                Autoplay
              </Button>
            </Skeleton>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
