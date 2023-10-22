import React from "react";

import { Stack } from "@chakra-ui/react";

import { ImportTermsModal } from "../components/import-terms-modal";
import { useSetEditorContext } from "../stores/use-set-editor-store";
import { ButtonArea } from "./editor/button-area";
import { TermsListPure } from "./editor/terms-list";
import { TitleProperties } from "./editor/title-properties";
import { TopBar } from "./editor/top-bar";

export const SetEditor = () => {
  const [importOpen, setImportOpen] = React.useState(false);
  const bulkAddTerms = useSetEditorContext((s) => s.bulkAddTerms);

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
      <TopBar />
      <TitleProperties />
      <ButtonArea onImportOpen={() => setImportOpen(true)} />
      <TermsListPure />
    </Stack>
  );
};

export const SetEditorPure = React.memo(SetEditor);
