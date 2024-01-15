import { nanoid } from "nanoid";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { Language } from "@quenti/core/language";
import type { FacingTerm } from "@quenti/interfaces";
import type { StudySetType, StudySetVisibility } from "@quenti/prisma/client";

export type ClientTerm = Omit<
  FacingTerm,
  "studySetId" | "wordRichText" | "definitionRichText"
> & {
  clientKey: string;
  wordRichText?: JSON | null;
  definitionRichText?: JSON | null;
};

interface SetEditorProps {
  id: string;
  mode: "create" | "edit";
  type: StudySetType;
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
  classesWithAccess: string[];
  terms: ClientTerm[];
  serverTerms: string[];
  visibleTerms: number[];
  lastCreated?: string;
  currentActiveRank?: number;
  readonly?: boolean;
  collab?: {
    minTerms: number;
    maxTerms: number;
  };
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
  setClassesWithAccess: (classes: string[]) => void;
  addTerm: (rank: number) => void;
  bulkAddTerms: (
    terms: { word: string; definition: string }[],
    deleted?: string[],
  ) => void;
  deleteTerm: (id: string) => void;
  setServerTermId: (oldId: string, serverId: string) => void;
  editTerm: (
    id: string,
    word: string,
    definition: string,
    wordRichText?: JSON,
    definitionRichText?: JSON,
  ) => void;
  setImage: (id: string, assetUrl: string) => void;
  removeImage: (id: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  flipTerms: () => void;
  addServerTerms: (terms: string[]) => void;
  removeServerTerms: (term: string[]) => void;
  setTermVisible: (rank: number, visible: boolean) => void;
  setLastCreated: (id: string) => void;
  setCurrentActiveRank: (id: number) => void;
  onSubscribeDelegate: () => void;
  onComplete: () => void;
}

export type SetEditorStore = ReturnType<typeof createSetEditorStore>;

export const createSetEditorStore = (
  initProps?: Partial<SetEditorProps>,
  behaviors?: Partial<SetEditorState>,
) => {
  const DEFAULT_PROPS: SetEditorProps = {
    id: "",
    mode: "create",
    type: "Default",
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
    classesWithAccess: [],
    terms: [],
    serverTerms: [],
    readonly: false,
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
      setClassesWithAccess: (classes: string[]) => {
        set({ classesWithAccess: classes });
        behaviors?.setClassesWithAccess?.(classes);
      },
      addTerm: (rank: number) => {
        set((state) => {
          const clientKey = nanoid();

          const term: ClientTerm = {
            id: clientKey,
            clientKey,
            word: "",
            definition: "",
            wordRichText: null,
            definitionRichText: null,
            assetUrl: null,
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
        const deleted = new Array<string>();

        set((state) => {
          const filtered = state.terms
            .filter((x) => {
              const keep = !!x.word.length || !!x.definition.length;
              if (!keep && state.serverTerms.includes(x.id)) deleted.push(x.id);
              return keep;
            })
            .map((x, i) => ({ ...x, rank: i }));

          const newTerms = terms.map((term, i) => {
            const clientKey = nanoid();

            return {
              id: clientKey,
              clientKey,
              word: term.word,
              definition: term.definition,
              wordRichText: null,
              definitionRichText: null,
              assetUrl: null,
              rank: filtered.length + i,
            };
          });

          return {
            terms: [...filtered, ...newTerms],
          };
        });

        behaviors?.bulkAddTerms?.(terms, deleted);
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
      editTerm: (
        id: string,
        word: string,
        definition: string,
        wordRichText?: JSON,
        definitionRichText?: JSON,
      ) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === id
                ? { ...t, word, definition, wordRichText, definitionRichText }
                : t,
            ),
          };
        });
        behaviors?.editTerm?.(
          id,
          word,
          definition,
          wordRichText,
          definitionRichText,
        );
      },
      setImage: (id: string, assetUrl: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === id ? { ...t, assetUrl } : t,
            ),
          };
        });
        behaviors?.setImage?.(id, assetUrl);
      },
      removeImage: (id: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === id ? { ...t, assetUrl: null } : t,
            ),
          };
        });
        behaviors?.removeImage?.(id);
      },
      setServerTermId: (oldId: string, serverId: string) => {
        set((state) => {
          return {
            terms: state.terms.map((t) =>
              t.id === oldId ? { ...t, id: serverId } : t,
            ),
          };
        });
        behaviors?.setServerTermId?.(oldId, serverId);
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
              wordRichText: term.definitionRichText,
              definition: term.word,
              definitionRichText: term.wordRichText,
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
      removeServerTerms: (terms: string[]) => {
        set((state) => {
          return {
            serverTerms: state.serverTerms.filter((t) => !terms.includes(t)),
          };
        });
        behaviors?.removeServerTerms?.(terms);
      },
      setTermVisible: (rank: number, visible: boolean) => {
        set((state) => {
          if (!visible && !state.visibleTerms.includes(rank)) return {};

          const terms = (
            visible
              ? [...new Set([...state.visibleTerms, rank])]
              : state.visibleTerms.filter((t) => t != rank)
          ).sort((a, b) => a - b);

          return {
            visibleTerms: terms,
          };
        });
        behaviors?.setTermVisible?.(rank, visible);
      },
      setLastCreated: (id: string) => {
        set({ lastCreated: id });
        behaviors?.setLastCreated?.(id);
      },
      setCurrentActiveRank: (rank: number) => {
        set({ currentActiveRank: rank });
        behaviors?.setCurrentActiveRank?.(rank);
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
