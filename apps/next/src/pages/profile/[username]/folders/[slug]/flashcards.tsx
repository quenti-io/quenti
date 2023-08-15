import React from "react";

import { Container, Stack } from "@chakra-ui/react";

import type { ComponentWithAuth } from "../../../../../components/auth-component";
import { ControlsBar } from "../../../../../modules/flashcards/controls-bar";
import { FlashcardArea } from "../../../../../modules/flashcards/flashcard-area";
import { FlashcardsSettingsModal } from "../../../../../modules/flashcards/flashcards-settings-modal";
import { TitleBar } from "../../../../../modules/flashcards/titlebar";
import { HydrateFolderData } from "../../../../../modules/hydrate-folder-data";

const FolderStudyFlashcards: ComponentWithAuth = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <HydrateFolderData withTerms>
      <FlashcardsSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Container maxW="full" h="calc(100vh - 80px)" overflow="hidden" px="0">
        <Container maxW="7xl" h="calc(100vh - 180px)">
          <Stack spacing={6}>
            <TitleBar />
            <FlashcardArea />
            <ControlsBar onSettingsClick={() => setSettingsOpen(true)} />
          </Stack>
        </Container>
      </Container>
    </HydrateFolderData>
  );
};

FolderStudyFlashcards.authenticationEnabled = true;

export default FolderStudyFlashcards;
