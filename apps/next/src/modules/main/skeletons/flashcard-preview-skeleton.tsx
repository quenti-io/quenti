import React from "react";

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
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";

import { LoadingFlashcard } from "../../../components/loading-flashcard";
import { LinkAreaSkeleton } from "./link-area-skeleton";

export const FlashcardPreviewSkeletonRaw = () => {
  return (
    <Flex
      gap={8}
      flexDir={{ base: "column", lg: "row" }}
      alignItems="stretch"
      w="full"
    >
      <LinkAreaSkeleton />
      <Flex maxW="1000px" flex="1">
        <Box w="full">
          <LoadingFlashcard h="500px" />
        </Box>
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="space-between"
        w={{ base: "full", lg: "160px" }}
      >
        <Stack spacing={4} direction={{ base: "row", lg: "column" }}>
          <Stack direction={{ base: "row", lg: "column" }} w="full" spacing="3">
            <Skeleton w="full" rounded="lg">
              <Button w="full" leftIcon={<IconArrowsShuffle />}>
                Shuffle
              </Button>
            </Skeleton>
            <Skeleton w="full" rounded="lg">
              <Button w="full" leftIcon={<IconPlayerPlay />}>
                Autoplay
              </Button>
            </Skeleton>
          </Stack>
        </Stack>
        <Flex justifyContent={{ base: "end", lg: "start" }} marginTop="4">
          <Skeleton rounded="full">
            <IconButton
              w="max"
              icon={<IconSettings />}
              rounded="full"
              display={{ base: "flex", lg: "none" }}
              aria-label="Settings"
            />
          </Skeleton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const FlashcardPreviewSkeleton = React.memo(FlashcardPreviewSkeletonRaw);
