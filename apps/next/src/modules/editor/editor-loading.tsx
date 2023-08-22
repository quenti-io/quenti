import { Skeleton, Stack } from "@chakra-ui/react";

import { ButtonArea } from "./button-area";
import { TitleProperties } from "./title-properties";
import { TopBar } from "./top-bar";

export const EditorLoading = () => {
  return (
    <Stack spacing="8">
      <TopBar.Skeleton />
      <TitleProperties.Skeleton />
      <ButtonArea.Skeleton />
      <Stack spacing="4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="149px" w="full" rounded="xl" />
        ))}
      </Stack>
    </Stack>
  );
};
