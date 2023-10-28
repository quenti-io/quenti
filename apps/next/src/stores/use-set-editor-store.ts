import { nanoid } from "nanoid";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { Language } from "@quenti/core/language";
import type {
  AutoSaveTerm,
  StudySetVisibility,
  Term,
} from "@quenti/prisma/client";

interface SetEditorProps {
  mode: "create" | "edit";
  isSaving: boolean;
  isLoading: boolean;
  saveError?: string;
  savedAt: Date;
  title: string;
  description: string;
  tags: string[];
  wordLanguage: Language;
  definitionLanguage: Language;
  visibility: StudySetVisibility;
  terms: (Term | AutoSaveTerm)[];
  serverTerms: string[];
  visibleTerms: string[];
  lastCreated?: string;
}

interface SetEditorState extends SetEditorProps {
  setIsSaving: (isSaving: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSaveError: (error?: string) => void;
  setSavedAt: (date: Date) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTags: (tags: string[]) => void;
  setWordLanguage: (wordLanguage: Language) => void;
  setDefinitionLanguage: (definitionLanguage: Language) => void;
  setVisibility: (visibility: StudySetVisibility) => void;
  addTerm: (rank: number) => void;
  bulkAddTerms: (terms: { word: string; definition: string }[]) => void;
  deleteTerm: (id: string) => void;
  changeTermId: (oldId: string, newId: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  flipTerms: () => void;
  addServerTerms: (terms: string[]) => void;
  removeServerTerm: (term: string) => void;
  setTermVisible: (id: string, visible: boolean) => void;
  setLastCreated: (id: string) => void;
  onSubscribeDelegate: () => void;
  onComplete: () => void;
}

export type SetEditorStore = ReturnType<typeof createSetEditorStore>;

export const createSetEditorStore = (
  initProps?: Partial<SetEditorProps>,
  behaviors?: Partial<SetEditorState>,
) => {
  const DEFAULT_PROPS: SetEditorProps = {
    mode: "create",
    isSaving: false,
    isLoading: false,
    savedAt: new Date(),
    title: "",
    description: "",
    wordLanguage: "en",
    definitionLanguage: "en",
    tags: [],
    visibleTerms: [],
    visibility: "Public",
    terms: [],
    serverTerms: [],
  };

  return createStore<SetEditorState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      setIsSaving: (isSaving: boolean) => set({ isSaving }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setSaveError: (error?: string) => set({ saveError: error }),
      setSavedAt: (date: Date) => set({ savedAt: date }),
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      setTags: (tags: string[]) => set({ tags }),
      setWordLanguage: (wordLanguage: Language) => set({ wordLanguage }),
      setDefinitionLanguage: (definitionLanguage: Language) =>
        set({ definitionLanguage }),
      setVisibility: (visibility: StudySetVisibility) => set({ visibility }),
      addTerm: (rank: number) => {
        set((state) => {
          const term: AutoSaveTerm = {
            id: nanoid(),
            word: "",
            definition: "",
            setAutoSaveId: "",
            rank,
          };

          return {
            terms: [
              ...state.terms.map((t) =>
                t.rank >= rank ? { ...t, rank: t.rank + 1 } : t,
              ),
              term,
            ],
            lastCreated: term.id,
          };
        });
        behaviors?.addTerm?.(rank);
      },
      bulkAddTerms: (terms: { word: string; definition: string }[]) => {
        set((state) => {
          const filtered = state.terms
            .filter((x) => !!x.word.length || !!x.definition.length)
            .map((x, i) => ({ ...x, rank: i }));

          const newTerms = terms.map((term, i) => ({
            id: nanoid(),
            word: term.word,
            definition: term.definition,
            setAutoSaveId: "",
            rank: filtered.length + i,
          }));

          return {
            terms: [...filtered, ...newTerms],
          };
        });
        behaviors?.bulkAddTerms?.(terms);
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
                  : term,
              )
              .filter((term) => term.id !== id),
          };
        });
        behaviors?.deleteTerm?.(id);
      },
      editTerm: (id: string, word: string, definition: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === id ? { ...t, word, definition } : t,
            ),
          };
        });
        behaviors?.editTerm?.(id, word, definition);
      },
      changeTermId: (oldId: string, newId: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === oldId ? { ...t, id: newId } : t,
            ),
          };
        });
        behaviors?.changeTermId?.(oldId, newId);
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
        behaviors?.reorderTerm?.(id, rank);
      },
      flipTerms: () => {
        set((state) => {
          return {
            wordLanguage: state.definitionLanguage,
            definitionLanguage: state.wordLanguage,
            terms: state.terms.map((term) => ({
              ...term,
              word: term.definition,
              definition: term.word,
            })),
          };
        });
        behaviors?.flipTerms?.();
      },
      addServerTerms: (terms: string[]) => {
        set((state) => {
          return {
            serverTerms: [...new Set([...state.serverTerms, ...terms])],
          };
        });
        behaviors?.addServerTerms?.(terms);
      },
      removeServerTerm: (term: string) => {
        set((state) => {
          return {
            serverTerms: state.serverTerms.filter((t) => t !== term),
          };
        });
        behaviors?.removeServerTerm?.(term);
      },
      setTermVisible: (id: string, visible: boolean) => {
        set((state) => {
          return {
            visibleTerms: visible
              ? [...new Set([...state.visibleTerms, id])]
              : state.visibleTerms.filter((t) => t !== id),
          };
        });
        behaviors?.setTermVisible?.(id, visible);
      },
      setLastCreated: (id: string) => {
        set({ lastCreated: id });
        behaviors?.setLastCreated?.(id);
      },
      onSubscribeDelegate: () => {
        behaviors?.onSubscribeDelegate?.();
      },
      onComplete: () => {
        behaviors?.onComplete?.();
      },
    })),
  );
};

export const SetEditorStoreContext = React.createContext<SetEditorStore | null>(
  null,
);

export const useSetEditorContext = <T>(
  selector: (state: SetEditorState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  const store = React.useContext(SetEditorStoreContext);
  if (!store) throw new Error("Missing SetEditorContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
