import { Container, Stack } from "@chakra-ui/react";

import { WithFooter } from "../../components/with-footer";
import { DescriptionAreaSkeleton } from "./skeletons/description-area-skeleton";
import { FlashcardPreviewSkeleton } from "./skeletons/flashcard-preview-skeleton";
import { HeadingAreaSkeleton } from "./skeletons/heading-area-skeleton";

export const SetLoading = () => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing="10">
          <HeadingAreaSkeleton />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" px="0" py="6">
        <Container maxW="7xl" p="4">
          <Stack spacing={10} w="full">
            <FlashcardPreviewSkeleton />
            <DescriptionAreaSkeleton />
          </Stack>
        </Container>
      </Container>
    </WithFooter>
  );
};

export default SetLoading;
