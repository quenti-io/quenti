import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AutoSaveTerm, Language, Term } from "@prisma/client";
import { TermCard } from "./term-card";

export interface SortableTermCardProps {
  isCurrent: boolean;
  isDragging: boolean;
  justCreated: boolean;
  term: Term | AutoSaveTerm;
  deletable: boolean;
  wordLanguage: Language;
  definitionLanguage: Language;
  editTerm: (id: string, word: string, definition: string) => void;
  deleteTerm: (id: string) => void;
  setWordLanguage: (l: Language) => void;
  setDefinitionLanguage: (l: Language) => void;
  anyFocus: () => void;
  onTabOff: () => void;
}

export const SortableTermCard: React.FC<SortableTermCardProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.term.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: props.isDragging ? 200 : undefined,
    opacity: props.isDragging ? 0.75 : undefined,
  };

  return (
    <TermCard
      {...props}
      style={style}
      attributes={attributes}
      listeners={listeners}
      ref={setNodeRef}
    />
  );
};