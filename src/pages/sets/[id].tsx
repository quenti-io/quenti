import { Container, Divider, Stack } from "@chakra-ui/react";
import type { ComponentWithAuth } from "../../components/auth-component";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { DescriptionArea } from "../../modules/main/description-area";
import { FlashcardPreview } from "../../modules/main/flashcard-preview";
import { HeadingArea } from "../../modules/main/heading-area";
import { LinkArea } from "../../modules/main/link-area";
import { TermsOverview } from "../../modules/main/terms-overview";

const Set: ComponentWithAuth = () => {
  return (
    <HydrateSetData>
      <Container maxW="7xl">
        <Stack spacing={10}>
          <HeadingArea />
          <LinkArea />
          <Divider />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" p="0" py="8">
        <Container maxW="7xl">
          <Stack spacing={10}>
            <FlashcardPreview />
            <DescriptionArea />
          </Stack>
        </Container>
      </Container>
      <Container maxW="7xl" marginBottom="20">
        <Stack spacing={10}>
          <TermsOverview />
        </Stack>
      </Container>
    </HydrateSetData>
  );
};

Set.authenticationEnabled = true;

export default Set;

export { getServerSideProps } from "../../components/chakra";
