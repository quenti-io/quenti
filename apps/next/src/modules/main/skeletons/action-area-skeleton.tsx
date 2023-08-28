import React from "react";

import { ButtonGroup, IconButton, Skeleton } from "@chakra-ui/react";

import { IconHexagon } from "@tabler/icons-react";

export const ActionAreaSkeletonRaw = () => {
  return (
    <Skeleton fitContent rounded="xl">
      <ButtonGroup isAttached colorScheme="gray" size="lg" rounded="xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <IconButton
            key={i}
            rounded="xl"
            aria-label="loading"
            icon={<IconHexagon size={18} />}
          />
        ))}
      </ButtonGroup>
    </Skeleton>
  );
};

export const ActionAreaSkeleton = React.memo(ActionAreaSkeletonRaw);
