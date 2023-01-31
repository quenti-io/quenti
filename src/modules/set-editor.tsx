import { Stack } from "@chakra-ui/react";
import type { AutoSaveTerm, Term } from "@prisma/client";
import React from "react";
import { ImportTermsModal } from "../components/import-terms-modal";
import { ButtonArea } from "./editor/button-area";
import { TermsList } from "./editor/terms-list";
import { TitleProperties } from "./editor/title-properties";
import { TopBar } from "./editor/top-bar";

export interface SetEditorProps {
  title: string;
  description: string;
  numTerms: number;
  isSaving: boolean;
  terms: (Term | AutoSaveTerm)[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addTerm: () => void;
  deleteTerm: (id: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  onBulkImportTerms: (terms: { word: string; definition: string }[]) => void;
  onFlipTerms: () => void;
}

export const SetEditor: React.FC<SetEditorProps> = ({
  title,
  description,
  numTerms,
  isSaving,
  terms,
  setTitle,
  setDescription,
  addTerm,
  deleteTerm,
  editTerm,
  reorderTerm,
  onBulkImportTerms,
  onFlipTerms,
}) => {
  const [importOpen, setImportOpen] = React.useState(false);

  return (
    <Stack spacing={8}>
      <ImportTermsModal
        isOpen={importOpen}
        onClose={() => {
          setImportOpen(false);
        }}
        onImport={(terms) => {
          onBulkImportTerms(terms);
          setImportOpen(false);
        }}
      />
      <TopBar isSaving={isSaving} numTerms={numTerms} />
      <TitleProperties
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        numTerms={numTerms}
      />
      <ButtonArea
        onImportOpen={() => setImportOpen(true)}
        onFlipTerms={onFlipTerms}
      />
      <TermsList
        terms={terms}
        addTerm={addTerm}
        deleteTerm={deleteTerm}
        editTerm={editTerm}
        reorderTerm={reorderTerm}
      />
    </Stack>
  );
};
