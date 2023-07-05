import { Button, Flex, IconButton, Skeleton, Stack } from "@chakra-ui/react";
import {
  IconArrowsShuffle,
  IconMaximize,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { RootFlashcardWrapper } from "../../components/root-flashcard-wrapper";
import { SetReady } from "../../components/set-ready";
import { useSet, useSetReady } from "../../hooks/use-set";
import { FlashcardsSettingsModal } from "../../modules/flashcards/flashcards-settings-modal";
import { useContainerContext } from "../../stores/use-container-store";
import { useSetPropertiesStore } from "../../stores/use-set-properties-store";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

export const FlashcardPreview = () => {
  const ready = useSetReady();
  const data = useSet();
  const enableCardsSorting = useContainerContext((s) => s.enableCardsSorting);
  const isDirty = useSetPropertiesStore((s) => s.isDirty);
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  const apiSetShuffle = api.container.setShuffle.useMutation({
    onSuccess: () => {
      if (enableCardsSorting) {
        setIsDirty(true);
      }
    },
  });

  const [_shuffle, toggleShuffle] = useContainerContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);
  const [shuffle, setShuffle] = React.useState(_shuffle);
  const [autoplay, toggleAutoplay] = useContainerContext((s) => [
    s.autoplayFlashcards,
    s.toggleAutoplayFlashcards,
  ]);

  React.useEffect(() => {
    if (!isDirty && !apiSetShuffle.isLoading) setShuffle(_shuffle);
  }, [isDirty, _shuffle, apiSetShuffle.isLoading]);

  const _termOrder = ready
    ? data.terms.sort((a, b) => a.rank - b.rank).map((t) => t.id)
    : [];
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder
  );

  const length = ready ? data.terms.length : 0;
  React.useEffect(() => {
    setTermOrder(shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle, length]);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <SetReady>
        <FlashcardsSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </SetReady>
      <Flex
        gap={8}
        flexDir={{ base: "column", md: "row" }}
        alignItems="stretch"
        w="full"
      >
        <Flex maxW="1000px" flex="1">
          <Skeleton
            fitContent
            w="full"
            rounded="lg"
            isLoaded={ready}
            minH="500px"
          >
            {!!termOrder.length && (
              <RootFlashcardWrapper terms={data.terms} termOrder={termOrder} />
            )}
          </Skeleton>
        </Flex>
        <Flex flexDir="column" justifyContent="space-between">
          <Stack spacing={4}>
            <Stack
              direction={{ base: "row", md: "column" }}
              w="full"
              spacing={4}
            >
              <Skeleton isLoaded={ready} rounded="md" w="full">
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
                  isLoading={
                    enableCardsSorting && (apiSetShuffle.isLoading || isDirty)
                  }
                >
                  Shuffle
                </Button>
              </Skeleton>
              <Skeleton isLoaded={ready} rounded="md" w="full">
                <Button
                  leftIcon={<IconPlayerPlay />}
                  variant={autoplay ? "solid" : "outline"}
                  w="full"
                  onClick={toggleAutoplay}
                  isDisabled={enableCardsSorting}
                >
                  Autoplay
                </Button>
              </Skeleton>
            </Stack>
            <Skeleton isLoaded={ready} rounded="md">
              <Button
                leftIcon={<IconSettings />}
                variant="ghost"
                display={{ base: "none", md: "flex" }}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </Button>
            </Skeleton>
          </Stack>
          <Flex justifyContent={{ base: "end", md: "start" }} marginTop="4">
            <Skeleton
              display={{ base: "flex", md: "none" }}
              isLoaded={ready}
              startColor="transparent"
              endColor="transparent"
            >
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
            </Skeleton>
            <Skeleton
              isLoaded={ready}
              startColor="transparent"
              endColor="transparent"
            >
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
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
