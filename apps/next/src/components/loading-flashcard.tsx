import React from "react";

import { Box, Card, Progress, Skeleton } from "@chakra-ui/react";

export const LoadingFlashcard: React.FC<{ h?: string }> = ({ h }) => {
  return (
    <Box position="relative" rounded="xl" overflow="hidden" shadow="xl">
      <Skeleton rounded="xl" variant="card">
        <Card w="full" minH={h} rounded="xl" border="2px" />
      </Skeleton>
      <Progress
        position="absolute"
        top="0"
        left="0"
        w="full"
        isIndeterminate
        size="xs"
        colorScheme="orange"
        zIndex="1000"
      />
    </Box>
  );
};
