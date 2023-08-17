import { Container, Stack } from "@chakra-ui/react";

import { DescriptionArea } from "../modules/main/description-area";
import { FlashcardPreview } from "../modules/main/flashcard-preview";
import { HeadingArea } from "../modules/main/heading-area";
import { TermsOverview } from "../modules/main/terms-overview";
import { WithFooter } from "./with-footer";

const InternalSet = () => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing={10}>
          <HeadingArea />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" px="0" py="6">
        <Container maxW="7xl" p="4">
          <Stack spacing={10} w="full">
            <FlashcardPreview />
            <DescriptionArea />
          </Stack>
        </Container>
      </Container>
      <Container maxW="7xl">
        <Stack spacing={10}>
          <TermsOverview />
        </Stack>
      </Container>
    </WithFooter>
  );
};

export default InternalSet;
