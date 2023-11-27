import React from "react";

import { Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../common/editor-global-styles";
import { ImportTermsModal } from "../components/import-terms-modal";
import { SearchImagesModal } from "../components/search-images-modal";
import { editorEventChannel } from "../events/editor";
import { useSetEditorContext } from "../stores/use-set-editor-store";
import { ButtonArea } from "./editor/button-area";
import { TermsListPure } from "./editor/terms-list";
import { TitleProperties } from "./editor/title-properties";
import { TopBar } from "./editor/top-bar";

export const SetEditor = () => {
  const [importOpen, setImportOpen] = React.useState(false);
  const [searchImagesOpen, setSearchImagesOpen] = React.useState(false);
  const bulkAddTerms = useSetEditorContext((s) => s.bulkAddTerms);

  React.useEffect(() => {
    const open = () => setSearchImagesOpen(true);

    editorEventChannel.on("openSearchImages", open);
    return () => {
      editorEventChannel.off("openSearchImages", open);
    };
  }, []);

  return (
    <Stack spacing={8}>
      <ImportTermsModal
        isOpen={importOpen}
        onClose={() => {
          setImportOpen(false);
        }}
        onImport={(terms) => {
          bulkAddTerms(terms);
          setImportOpen(false);
        }}
      />
      <SearchImagesModal
        isOpen={searchImagesOpen}
        onClose={() => {
          setSearchImagesOpen(false);
        }}
      />
      <TopBar />
      <TitleProperties />
      <ButtonArea onImportOpen={() => setImportOpen(true)} />
      <EditorGlobalStyles />
      <TermsListPure />
    </Stack>
  );
};

export const SetEditorPure = React.memo(SetEditor);
