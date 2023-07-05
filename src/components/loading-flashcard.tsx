import { Box, Card, Progress, Skeleton } from "@chakra-ui/react";
import React from "react";

export const LoadingFlashcard: React.FC<{ h?: string }> = ({ h }) => {
  return (
    <Box position="relative" rounded="xl" overflow="hidden">
      <Skeleton rounded="xl">
        <Card w="full" minH={h} rounded="xl" shadow="none" border="2px" />
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
