import { Button, Stack } from "@chakra-ui/react";
import type { Language } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { useShortcut } from "../../hooks/use-shortcut";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { TermCardPure } from "./term-card";

export const TermsList = () => {
  const terms = useSetEditorContext((s) => s.terms);
  const reorderTerm = useSetEditorContext((s) => s.reorderTerm);
  const languages = useSetEditorContext((s) => s.languages);
  const setLanguages = useSetEditorContext((s) => s.setLanguages);
  const addTerm = useSetEditorContext((s) => s.addTerm);
  const editTerm = useSetEditorContext((s) => s.editTerm);
  const deleteTerm = useSetEditorContext((s) => s.deleteTerm);

  const wordLanguage = languages[0]!;
  const definitionLanguage = languages[1]!;
  const setWordLanguage = (language: Language) =>
    setLanguages([language, languages[1]!]);
  const setDefinitionLanguage = (language: Language) =>
    setLanguages([languages[0]!, language]);

  const [current, setCurrent] = React.useState<string | null>(null);

  useShortcut(
    ["ArrowDown"],
    () => {
      if (!current) return;
      const rank = terms.find((x) => x.id === current)!.rank;
      if (rank < terms.length - 1) reorderTerm(current, rank + 1);
    },
    {
      altKey: true,
    }
  );

  useShortcut(
    ["ArrowUp"],
    () => {
      if (!current) return;
      const rank = terms.find((x) => x.id === current)!.rank;
      if (rank > 0) reorderTerm(current, rank - 1);
    },
    {
      altKey: true,
    }
  );

  return (
    <Stack spacing={10}>
      <Stack spacing={4} py="10">
        {terms
          .sort((a, b) => a.rank - b.rank)
          .map((term, i) => (
            <TermCardPure
              isCurrent={current === term.id}
              deletable={terms.length > 1}
              key={term.id}
              term={term}
              wordLanguage={wordLanguage}
              definitionLanguage={definitionLanguage}
              setWordLanguage={setWordLanguage}
              setDefinitionLanguage={setDefinitionLanguage}
              editTerm={editTerm}
              deleteTerm={deleteTerm}
              onTabOff={() => {
                if (i === terms.length - 1) addTerm();
              }}
              anyFocus={() => setCurrent(term.id)}
            />
          ))}
      </Stack>
      <Button
        leftIcon={<IconPlus />}
        size="lg"
        height="24"
        variant="outline"
        onClick={addTerm}
      >
        Add Card
      </Button>
    </Stack>
  );
};

export const TermsListPure = React.memo(TermsList);
