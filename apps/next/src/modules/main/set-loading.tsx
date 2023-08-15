import { Container, Stack } from "@chakra-ui/react";

import { WithFooter } from "../../components/with-footer";
import { DescriptionArea } from "./description-area";
import { FlashcardPreview } from "./flashcard-preview";
import { HeadingArea } from "./heading-area";

export const SetLoading = () => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing="10">
          <HeadingArea.Skeleton />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" px="0" py="6">
        <Container maxW="7xl" p="4">
          <Stack spacing={10} w="full">
            <FlashcardPreview.Skeleton />
            <DescriptionArea.Skeleton />
          </Stack>
        </Container>
      </Container>
    </WithFooter>
  );
};
