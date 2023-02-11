import { Container, Stack } from "@chakra-ui/react";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { ControlsBar } from "../../../modules/flashcards/controls-bar";
import { FlashcardArea } from "../../../modules/flashcards/flashcard-area";
import { TitleBar } from "../../../modules/flashcards/titlebar";
import { HydrateSetData } from "../../../modules/hydrate-set-data";

const Flashcards: ComponentWithAuth = () => {
  return (
    <HydrateSetData>
      <Container maxW="full" h="calc(100vh - 80px)" overflow="hidden" px="0">
        <Container maxW="7xl" h="calc(100vh - 180px)">
          <Stack spacing={6}>
            <TitleBar />
            <FlashcardArea />
            <ControlsBar />
          </Stack>
        </Container>
      </Container>
    </HydrateSetData>
  );
};

Flashcards.authenticationEnabled = true;

export default Flashcards;

export { getServerSideProps } from "../../../components/chakra";
