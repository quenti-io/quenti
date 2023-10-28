import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import type { Language } from "@quenti/core/language";
import type { AutoSaveTerm, Term } from "@quenti/prisma/client";

import { TermCard } from "./term-card";

export interface SortableTermCardProps {
  isCurrent: boolean;
  isDragging: boolean;
  justCreated: boolean;
  term: Term | AutoSaveTerm;
  deletable: boolean;
  wordLanguage: Language;
  definitionLanguage: Language;
  openMenu: (type: "word" | "definition") => void;
  editTerm: (id: string, word: string, definition: string) => void;
  deleteTerm: (id: string) => void;
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

  React.useEffect(() => {
    console.log("REMOVE");
  }, []);

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
