import { Skeleton, Stack } from "@chakra-ui/react";

import { ButtonArea } from "./button-area";
import { TitleProperties } from "./title-properties";
import { TopBar } from "./top-bar";

export interface EditorLoadingProps {
  mode: "create" | "edit";
}

export const EditorLoading: React.FC<EditorLoadingProps> = ({ mode }) => {
  return (
    <Stack spacing="8">
      <TopBar.Skeleton />
      <TitleProperties.Skeleton />
      <ButtonArea.Skeleton mode={mode} />
      <Stack spacing="4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="153px" w="full" rounded="xl" />
        ))}
      </Stack>
    </Stack>
  );
};
