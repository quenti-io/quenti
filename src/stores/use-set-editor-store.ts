import type {
  AutoSaveTerm,
  Language,
  StudySetVisibility,
  Term,
} from "@prisma/client";
import { nanoid } from "nanoid";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SetEditorProps {
  title: string;
  description: string;
  tags: string[];
  languages: Language[];
  visibility: StudySetVisibility;
  terms: (Term | AutoSaveTerm)[];
}

interface SetEditorState extends SetEditorProps {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTags: (tags: string[]) => void;
  setLanguages: (languages: Language[]) => void;
  setVisibility: (visibility: StudySetVisibility) => void;
  addTerm: () => void;
  bulkAddTerms: (terms: { word: string; definition: string }[]) => void;
  deleteTerm: (id: string) => void;
  changeTermId: (oldId: string, newId: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  flipTerms: () => void;
}

export type SetEditorStore = ReturnType<typeof createSetEditorStore>;

export const createSetEditorStore = (initProps?: Partial<SetEditorProps>) => {
  const DEFAULT_PROPS: SetEditorProps = {
    title: "",
    description: "",
    languages: ["English", "English"],
    tags: [],
    visibility: "Public",
    terms: [],
  };

  return createStore<SetEditorState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      setTags: (tags: string[]) => set({ tags }),
      setLanguages: (languages: Language[]) => set({ languages }),
      setVisibility: (visibility: StudySetVisibility) => set({ visibility }),
      addTerm: () =>
        set((state) => {
          const term: AutoSaveTerm = {
            id: nanoid(),
            word: "",
            definition: "",
            setAutoSaveId: "",
            rank: state.terms.length,
          };

          return {
            terms: [...state.terms, term],
          };
        }),
      bulkAddTerms: (terms: { word: string; definition: string }[]) => {
        set((state) => {
          const newTerms = terms.map((term, i) => ({
            id: nanoid(),
            word: term.word,
            definition: term.definition,
            setAutoSaveId: "",
            rank: state.terms.length + i,
          }));

          return {
            terms: [...state.terms, ...newTerms],
          };
        });
      },
      deleteTerm: (id: string) => {
        set((state) => {
          const active = state.terms.find((t) => t.id === id);
          if (!active) return {};

          return {
            terms: state.terms
              .map((term) =>
                term.rank > active.rank
                  ? { ...term, rank: term.rank - 1 }
                  : term
              )
              .filter((term) => term.id !== id),
          };
        });
      },
      editTerm: (id: string, word: string, definition: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === id ? { ...t, word, definition } : t
            ),
          };
        });
      },
      changeTermId: (oldId: string, newId: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === oldId ? { ...t, id: newId } : t
            ),
          };
        });
      },
      reorderTerm: (id: string, rank: number) => {
        set((state) => {
          const term = state.terms.find((t) => t.id === id)!;

          const newTerms = state.terms.filter((t) => t.id !== id);
          newTerms.splice(rank, 0, term);

          return {
            terms: newTerms.map((t, i) => ({ ...t, rank: i })),
          };
        });
      },
      flipTerms: () => {
        set((state) => {
          return {
            terms: state.terms.map((term) => ({
              ...term,
              word: term.definition,
              definition: term.word,
            })),
          };
        });
      },
    }))
  );
};

export const SetEditorContext = React.createContext<SetEditorStore | null>(
  null
);

export const useSetEditorContext = <T>(
  selector: (state: SetEditorState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = React.useContext(SetEditorContext);
  if (!store) throw new Error("Missing SetEditorContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
