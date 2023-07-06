import { Container, Divider, Stack } from "@chakra-ui/react";
import type { ComponentWithAuth } from "../../components/auth-component";
import { WithFooter } from "../../components/with-footer";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { DescriptionArea } from "../../modules/main/description-area";
import { FlashcardPreview } from "../../modules/main/flashcard-preview";
import { HeadingArea } from "../../modules/main/heading-area";
import { LinkArea } from "../../modules/main/link-area";
import { TermsOverview } from "../../modules/main/terms-overview";
import { SetLoading } from "../../modules/main/set-loading";

const Set: ComponentWithAuth = () => {
  return (
    <HydrateSetData placeholder={<SetLoading />}>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={10}>
            <HeadingArea />
            <LinkArea />
            <Divider maxW="1000px" />
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
