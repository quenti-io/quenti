import React from "react";

import { Container, Stack } from "@chakra-ui/react";

import { WithFooter } from "../../components/with-footer";
import { DescriptionAreaSkeleton } from "./skeletons/description-area-skeleton";
import { FlashcardPreviewSkeleton } from "./skeletons/flashcard-preview-skeleton";
import { HeadingAreaSkeleton } from "./skeletons/heading-area-skeleton";

interface SetLoadingProps {
  collab?: boolean;
}

export const SetLoadingRaw: React.FC<SetLoadingProps> = ({ collab }) => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing="10">
          <HeadingAreaSkeleton collab={collab} />
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

export const SetLoading = React.memo(SetLoadingRaw);
