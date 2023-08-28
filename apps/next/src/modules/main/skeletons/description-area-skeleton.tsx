import React from "react";

import {
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ActionAreaSkeleton } from "./action-area-skeleton";

export const DescriptionAreaSkeletonRaw = () => {
  return (
    <Stack spacing={8}>
      <Flex
        justifyContent={{ base: "start", sm: "space-between" }}
        flexDir={{ base: "column", sm: "row" }}
        gap={{ base: 8, sm: 0 }}
      >
        <HStack spacing={4}>
          <Skeleton w="12" h="12" rounded="full" />
          <Stack spacing={0}>
            <Flex alignItems="center" h="18px">
              <SkeletonText skeletonHeight="3" noOfLines={1}>
                <Text fontSize="xs">Created by</Text>
              </SkeletonText>
            </Flex>
            <Flex alignItems="center" h="6">
              <SkeletonText skeletonHeight="4" noOfLines={1}>
                <Text fontWeight={700}>placeholder</Text>
              </SkeletonText>
            </Flex>
          </Stack>
        </HStack>
        <ActionAreaSkeleton />
      </Flex>
    </Stack>
  );
};

export const DescriptionAreaSkeleton = React.memo(DescriptionAreaSkeletonRaw);
