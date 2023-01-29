import { Container, Stack } from "@chakra-ui/react";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { TitleBar } from "../../modules/flashcards/titlebar";
import { FlashcardArea } from "../../modules/flashcards/flashcard-area";
import { ControlsBar } from "../../modules/flashcards/controls-bar";

export default function Flashcards() {
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
}

export { getServerSideProps } from "../../components/chakra";
