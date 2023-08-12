import { Container, Stack } from "@chakra-ui/react";
import type { ComponentWithAuth } from "../../components/auth-component";
import { WithFooter } from "../../components/with-footer";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { DescriptionArea } from "../../modules/main/description-area";
import { FlashcardPreview } from "../../modules/main/flashcard-preview";
import { HeadingArea } from "../../modules/main/heading-area";
import { LinkArea } from "../../modules/main/link-area";
import { SetLoading } from "../../modules/main/set-loading";
import { TermsOverview } from "../../modules/main/terms-overview";

const Set: ComponentWithAuth = () => {
  return (
    <HydrateSetData placeholder={<SetLoading />}>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={10}>
            <HeadingArea />
            <LinkArea />
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
    </HydrateSetData>
  );
};

Set.authenticationEnabled = false;

export default Set;
