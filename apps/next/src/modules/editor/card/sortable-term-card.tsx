import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import type { Language } from "@quenti/core/language";

import {
  type ClientTerm,
  useSetEditorContext,
} from "../../../stores/use-set-editor-store";
import { TermCard } from "./term-card";

export interface SortableTermCardProps {
  isCurrent: boolean;
  isDragging: boolean;
  justCreated: boolean;
  isLast: boolean;
  term: ClientTerm;
  deletable: boolean;
  wordLanguage: Language;
  definitionLanguage: Language;
  openMenu: (type: "word" | "definition") => void;
  editTerm: (
    id: string,
    word: string,
    definition: string,
    wordRichText?: JSON,
    definitionRichText?: JSON,
  ) => void;
  deleteTerm: (id: string) => void;
  anyFocus: () => void;
  onTabOff: () => void;
}

export const SortableTermCard: React.FC<SortableTermCardProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.term.id });
  const readonly = useSetEditorContext((s) => s.readonly);

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
      listeners={!readonly ? listeners : undefined}
      ref={setNodeRef}
    />
  );
};
