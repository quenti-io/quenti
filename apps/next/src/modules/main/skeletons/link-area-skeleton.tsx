import React from "react";

import { SimpleGrid, Skeleton } from "@chakra-ui/react";

export const LinkAreaSkeletonRaw = () => {
  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} rounded="xl" h="59px" />
      ))}
    </SimpleGrid>
  );
};

export const LinkAreaSkeleton = React.memo(LinkAreaSkeletonRaw);
