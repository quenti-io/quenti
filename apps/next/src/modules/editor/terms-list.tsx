import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import React from "react";

import { useShortcut } from "@quenti/lib/hooks/use-shortcut";

import { Box, Button, Stack } from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { SortableTermCard } from "./card/sortable-term-card";
import { LanguageMenuWrapper } from "./language-menu";
import { TermCardGap } from "./term-card-gap";

export const TermsList = () => {
  const terms = useSetEditorContext((s) => s.terms);
  const reorderTerm = useSetEditorContext((s) => s.reorderTerm);
  const wordLanguage = useSetEditorContext((s) => s.wordLanguage);
  const definitionLanguage = useSetEditorContext((s) => s.definitionLanguage);
  const setWordLanguage = useSetEditorContext((s) => s.setWordLanguage);
  const setDefinitionLanguage = useSetEditorContext(
    (s) => s.setDefinitionLanguage,
  );
  const addTerm = useSetEditorContext((s) => s.addTerm);
  const editTerm = useSetEditorContext((s) => s.editTerm);
  const deleteTerm = useSetEditorContext((s) => s.deleteTerm);
  const lastCreated = useSetEditorContext((s) => s.lastCreated);
  const readonly = useSetEditorContext((s) => s.readonly);
  const collab = useSetEditorContext((s) => s.collab);

  const sensors = useSensors(useSensor(PointerSensor));

  const [current, setCurrent] = React.useState<string | null>(null);
  const [currentDrag, setCurrentDrag] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState<"word" | "definition">("word");
  const activeRef = React.useRef(active);
  activeRef.current = active;

  useShortcut(
    ["ArrowDown"],
    () => {
      if (!current) return;
      const rank = terms.find((x) => x.id === current)!.rank;
      if (rank < terms.length - 1) reorderTerm(current, rank + 1);
    },
    {
      altKey: true,
    },
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
    },
  );

  useShortcut(
    ["R"],
    () => {
      if (!current) return;
      const currentRank = terms.find((x) => x.id === current)!.rank;
      addTerm(currentRank + 1);
    },
    {
      ctrlKey: true,
      shiftKey: "R",
    },
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setCurrentDrag(active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const rank = terms.find((x) => x.id == over.id)!.rank;
      reorderTerm(active.id as string, rank);
    }

    setCurrentDrag(null);
  };

  const items = terms.sort((a, b) => a.rank - b.rank);
  const disableAdd =
    collab && collab.maxTerms ? terms.length >= collab.maxTerms : false;

  return (
    <Stack spacing={10}>
      <Stack spacing={0}>
        <LanguageMenuWrapper
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          selected={
            activeRef.current == "word" ? wordLanguage : definitionLanguage
          }
          onChange={(e) => {
            if (activeRef.current == "word") {
              setWordLanguage(e);
            } else {
              setDefinitionLanguage(e);
            }
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {items
                  .sort((a, b) => a.rank - b.rank)
                  .map((term, i) => (
                    <React.Fragment key={term.clientKey}>
                      <SortableTermCard
                        justCreated={lastCreated === term.clientKey}
                        isDragging={currentDrag === term.clientKey}
                        isCurrent={current === term.clientKey}
                        isLast={i === terms.length - 1}
                        deletable={
                          collab && collab.minTerms
                            ? terms.length > collab.minTerms
                            : terms.length > 2
                        }
                        key={term.clientKey}
                        term={term}
                        wordLanguage={wordLanguage}
                        definitionLanguage={definitionLanguage}
                        openMenu={(type) => {
                          setActive(type);
                          setMenuOpen(true);
                        }}
                        editTerm={editTerm}
                        deleteTerm={deleteTerm}
                        onTabOff={() => {
                          if (i === terms.length - 1) addTerm(terms.length);
                        }}
                        anyFocus={() => setCurrent(term.clientKey)}
                      />
                      {!readonly && !disableAdd ? (
                        <TermCardGap index={i} />
                      ) : (
                        <Box h="4" />
                      )}
                    </React.Fragment>
                  ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        </LanguageMenuWrapper>
      </Stack>
      {!readonly && (
        <Button
          leftIcon={<IconPlus size={18} />}
          size="lg"
          height="24"
          variant="outline"
          onClick={() => addTerm(terms.length)}
          isDisabled={disableAdd}
        >
          Add card
        </Button>
      )}
    </Stack>
  );
};

export const TermsListPure = React.memo(TermsList);
