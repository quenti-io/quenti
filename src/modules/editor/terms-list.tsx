import { Button, Stack } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { AutoSaveTerm, Language, Term } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { TermCard } from "./term-card";

export interface TermsListProps {
  terms: (Term | AutoSaveTerm)[];
  wordLanguage: Language;
  definitionLanguage: Language;
  addTerm: () => void;
  deleteTerm: (id: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  setWordLanguage: (l: Language) => void;
  setDefinitionLanguage: (l: Language) => void;
}

export const TermsList: React.FC<TermsListProps> = ({
  terms,
  wordLanguage,
  definitionLanguage,
  addTerm,
  deleteTerm,
  editTerm,
  reorderTerm,
  setWordLanguage,
  setDefinitionLanguage,
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const rank = terms.find((x) => x.id == over.id)!.rank;
      console.log(active.id, rank);
      reorderTerm(active.id as string, rank);
    }
  };

  const [currentCard, setCurrentCard] = React.useState<string | null>(null);

  return (
    <Stack spacing={10}>
      <Stack spacing={4} py="10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={terms} strategy={verticalListSortingStrategy}>
            {terms.map((term) => (
              <TermCard
                isCurrent={currentCard === term.id}
                deletable={terms.length > 1}
                key={term.id}
                term={term}
                wordLanguage={wordLanguage}
                definitionLanguage={definitionLanguage}
                setWordLanguage={setWordLanguage}
                setDefinitionLanguage={setDefinitionLanguage}
                editTerm={editTerm}
                deleteTerm={deleteTerm}
                anyFocus={() => setCurrentCard(term.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
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
