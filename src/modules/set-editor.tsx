import { Stack } from "@chakra-ui/react";
import type { AutoSaveTerm, StudySetVisibility, Term } from "@prisma/client";
import React from "react";
import { ImportTermsModal } from "../components/import-terms-modal";
import { ButtonArea } from "./editor/button-area";
import { TermsList } from "./editor/terms-list";
import { TitleProperties } from "./editor/title-properties";
import { TopBar } from "./editor/top-bar";

export interface SetEditorProps {
  mode: "create" | "edit";
  title: string;
  description: string;
  visibility: StudySetVisibility;
  numTerms: number;
  isSaving: boolean;
  isLoading: boolean;
  terms: (Term | AutoSaveTerm)[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (visibility: StudySetVisibility) => void;
  addTerm: () => void;
  deleteTerm: (id: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  onBulkImportTerms: (terms: { word: string; definition: string }[]) => void;
  onFlipTerms: () => void;
  onComplete: () => void;
}

export const SetEditor: React.FC<SetEditorProps> = ({
  mode,
  title,
  description,
  visibility,
  numTerms,
  isSaving,
  isLoading,
  terms,
  setTitle,
  setDescription,
  setVisibility,
  addTerm,
  deleteTerm,
  editTerm,
  reorderTerm,
  onBulkImportTerms,
  onFlipTerms,
  onComplete,
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
      <TopBar
        mode={mode}
        isSaving={isSaving}
        isLoading={isLoading}
        numTerms={numTerms}
        onComplete={onComplete}
      />
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
        visibility={visibility}
        onVisibilityChange={setVisibility}
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
