import { useRouter } from "next/router";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import { Container, Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../../../../../common/editor-global-styles";
import { LazyWrapper } from "../../../../../common/lazy-wrapper";
import { PageWrapper } from "../../../../../common/page-wrapper";
import { getLayout } from "../../../../../layouts/main-layout";
import { ControlsBar } from "../../../../../modules/flashcards/controls-bar";
import { FlashcardArea } from "../../../../../modules/flashcards/flashcard-area";
import { FlashcardsLoading } from "../../../../../modules/flashcards/flashcards-loading";
import { FlashcardsSettingsModal } from "../../../../../modules/flashcards/flashcards-settings-modal";
import { TitleBar } from "../../../../../modules/flashcards/titlebar";
import { HydrateFolderData } from "../../../../../modules/hydrate-folder-data";
import { TermImageLayer } from "../../../../../modules/term-image-layer";

const FolderStudyFlashcards = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <HeadSeo title="Flashcards" />
      <LazyWrapper>
        <EditorGlobalStyles />
        <TermImageLayer />
        <HydrateFolderData
          withTerms
          fallback={
            <FlashcardsLoading
              titlePlaceholder={(slug || "Placeholder Title").replace("-", "")}
            />
          }
        >
          <FlashcardsSettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
          <Container
            maxW="full"
            h="calc(100vh - 80px)"
            overflow="hidden"
            px="0"
          >
            <Container maxW="7xl" h="calc(100vh - 180px)">
              <Stack spacing={6}>
                <TitleBar />
                <FlashcardArea />
                <ControlsBar onSettingsClick={() => setSettingsOpen(true)} />
              </Stack>
            </Container>
          </Container>
        </HydrateFolderData>
      </LazyWrapper>
    </>
  );
};

FolderStudyFlashcards.PageWrapper = PageWrapper;
FolderStudyFlashcards.getLayout = getLayout;

export default FolderStudyFlashcards;
