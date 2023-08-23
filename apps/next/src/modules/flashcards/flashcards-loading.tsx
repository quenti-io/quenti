import { Container, Stack } from "@chakra-ui/react";

import { LoadingFlashcard } from "../../components/loading-flashcard";
import { ControlsBar } from "./controls-bar";
import { TitleBar } from "./titlebar";

interface FlashcardsLoadingProps {
  titlePlaceholder?: string;
}

export const FlashcardsLoading: React.FC<FlashcardsLoadingProps> = ({
  titlePlaceholder,
}) => {
  return (
    <Container
      maxW="full"
      h="calc(100vh - 80px)"
      minHeight="720px"
      px="0"
      overflow="hidden"
    >
      <Container maxW="7xl" h="calc(100vh - 180px)" minHeight="620px">
        <Stack spacing={6}>
          <TitleBar.Skeleton titlePlaceholder={titlePlaceholder} />
          <LoadingFlashcard h="max(calc(100vh - 240px), 560px)" />
          <ControlsBar.Skeleton />
        </Stack>
      </Container>
    </Container>
  );
};
