import { Box, Heading, Skeleton, Stack } from "@chakra-ui/react";

import { TopBar } from "../editor/top-bar";

export const CollabEditorLoading = () => {
  return (
    <Stack spacing="8">
      <TopBar.Skeleton />
      <Stack>
        <Box h="32px" />
        <Skeleton fitContent rounded="lg">
          <Heading>Collab Set Title Name</Heading>
        </Skeleton>
      </Stack>
      <Stack spacing="4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height="153px" w="full" rounded="xl" />
        ))}
      </Stack>
    </Stack>
  );
};
