import React from "react";

import { Box, HStack, Heading, SimpleGrid, Skeleton } from "@chakra-ui/react";

export const LinkAreaSkeletonRaw = () => {
  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      {["Learn", "Flashcards", "Test", "Match", "Crossword", "Gravity"].map(
        (title, i) => (
          <Box
            key={i}
            rounded="xl"
            h="59px"
            shadow="md"
            py="4"
            px="5"
            bg="white"
            borderBottomWidth="3px"
            borderColor="gray.200"
            _dark={{
              bg: "gray.750",
              borderColor: "gray.700",
            }}
          >
            <HStack spacing="3">
              <Skeleton
                w="6"
                h="6"
                rounded="lg"
                variant="refined"
                opacity="0.35"
              />
              <Skeleton h="14px" rounded="md" fitContent variant="refined">
                <Heading size="sm">{title}</Heading>
              </Skeleton>
            </HStack>
          </Box>
        ),
      )}
    </SimpleGrid>
  );
};

export const LinkAreaSkeleton = React.memo(LinkAreaSkeletonRaw);
