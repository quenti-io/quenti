import React from "react";

import { Flex, HStack, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";

interface HeadingAreaSkeletonProps {
  collab?: boolean;
}

export const HeadingAreaSkeletonRaw: React.FC<HeadingAreaSkeletonProps> = ({
  collab,
}) => {
  return (
    <Stack spacing={4}>
      {collab && <Skeleton w="88px" h="32px" rounded="xl" />}
      <Skeleton fitContent rounded="lg">
        <Heading size="2xl">Placeholder Set Title</Heading>
      </Skeleton>
      <Flex justifyContent="space-between" maxW="1000px" h="32px">
        <HStack fontWeight={600} spacing={2}>
          <Skeleton w="18px" h="18px" rounded="full" />
          <Skeleton fitContent h="18px" rounded="md">
            <HStack>
              <Text>Public</Text>
              <Text>•</Text>
              <Text>10 terms</Text>
            </HStack>
          </Skeleton>
        </HStack>
      </Flex>
    </Stack>
  );
};

export const HeadingAreaSkeleton = React.memo(HeadingAreaSkeletonRaw);
