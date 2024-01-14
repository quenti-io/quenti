import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import { Container, Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../../../common/editor-global-styles";
import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/main-layout";
import { ControlsBar } from "../../../modules/flashcards/controls-bar";
import { FlashcardArea } from "../../../modules/flashcards/flashcard-area";
import { FlashcardsLoading } from "../../../modules/flashcards/flashcards-loading";
import { FlashcardsSettingsModal } from "../../../modules/flashcards/flashcards-settings-modal";
import { TitleBar } from "../../../modules/flashcards/titlebar";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { TermImageLayer } from "../../../modules/term-image-layer";

const Flashcards = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <HeadSeo title="Flashcards" />
      <LazyWrapper>
        <EditorGlobalStyles />
        <TermImageLayer />
        <HydrateSetData isPublic placeholder={<FlashcardsLoading />} withCollab>
          <FlashcardsSettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
          <Container
            maxW="full"
            h="calc(100vh - 80px)"
            minHeight="720px"
            px="0"
            overflow="hidden"
          >
            <Container maxW="7xl" h="calc(100vh - 180px)" minHeight="620px">
              <Stack spacing={6}>
                <TitleBar />
                <FlashcardArea />
                <ControlsBar onSettingsClick={() => setSettingsOpen(true)} />
              </Stack>
            </Container>
          </Container>
        </HydrateSetData>
      </LazyWrapper>
    </>
  );
};

Flashcards.PageWrapper = PageWrapper;
Flashcards.getLayout = getLayout;

export default Flashcards;
