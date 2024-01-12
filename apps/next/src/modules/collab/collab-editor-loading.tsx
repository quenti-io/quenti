import { Box, HStack, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";

import { IconStack2 } from "@tabler/icons-react";

import { TopBar } from "../editor/top-bar";

export const CollabEditorLoading = () => {
  return (
    <Stack spacing="8">
      <TopBar.Skeleton />
      <Stack spacing="4">
        <Stack>
          <Box h="32px" />
          <Skeleton fitContent rounded="lg">
            <Heading>Collab Set Title Name</Heading>
          </Skeleton>
        </Stack>
        <Text whiteSpace="pre-wrap" />
        <HStack color="gray.500">
          <IconStack2 size="16" />
          <Text fontSize="sm" fontWeight={600}>
            Submit 10-20 terms
          </Text>
        </HStack>
      </Stack>
      <Stack spacing="4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height="153px" w="full" rounded="xl" />
        ))}
      </Stack>
    </Stack>
  );
};
