import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { singleIdServerSideProps as getServerSideProps } from "../../../common/server-side-props";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { ControlsBar } from "../../../modules/flashcards/controls-bar";
import { FlashcardArea } from "../../../modules/flashcards/flashcard-area";
import { FlashcardsSettingsModal } from "../../../modules/flashcards/flashcards-settings-modal";
import { TitleBar } from "../../../modules/flashcards/titlebar";
import { HydrateSetData } from "../../../modules/hydrate-set-data";

const Flashcards: ComponentWithAuth = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <HydrateSetData>
      <FlashcardsSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Container maxW="full" h="calc(100vh - 80px)" px="0" overflow="hidden">
        <Container maxW="7xl" h="calc(100vh - 180px)">
          <Stack spacing={6}>
            <TitleBar />
            <FlashcardArea />
            <ControlsBar onSettingsClick={() => setSettingsOpen(true)} />
          </Stack>
        </Container>
      </Container>
    </HydrateSetData>
  );
};

Flashcards.authenticationEnabled = true;

export default Flashcards;
export { getServerSideProps };
