import { Container, Divider, Stack } from "@chakra-ui/react";
import { WithFooter } from "../../components/with-footer";
import { FlashcardPreview } from "./flashcard-preview";
import { HeadingArea } from "./heading-area";
import { LinkArea } from "./link-area";
import { DescriptionArea } from "./description-area";

export const SetLoading = () => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing="10">
          <HeadingArea.Skeleton />
          <LinkArea.Skeleton />
          <Divider maxW="1000px" />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" p="0" py="8">
        <Container maxW="7xl">
          <Stack spacing={10}>
            <FlashcardPreview.Skeleton />
            <DescriptionArea.Skeleton />
          </Stack>
        </Container>
      </Container>
    </WithFooter>
  );
};
