import type { AutoSaveTerm } from "@prisma/client";
import { nanoid } from "nanoid";
import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const initialTerms = Array.from({ length: 5 }).map(() => ({
  id: nanoid(),
  word: "",
  definition: "",
})) as AutoSaveTerm[];

interface CreateSetProps {
  title: string;
  description: string;
  autoSaveTerms: AutoSaveTerm[];
}

interface CreateSetState extends CreateSetProps {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addTerm: () => void;
  bulkAddTerms: (terms: { word: string; definition: string }[]) => void;
  deleteTerm: (id: string) => void;
  editTerm: (id: string, word: string, definition: string) => void;
  reorderTerm: (id: string, rank: number) => void;
  flipTerms: () => void;
}

export type CreateSetStore = ReturnType<typeof createCreateSetStore>;

export const createCreateSetStore = (initProps?: Partial<CreateSetProps>) => {
  const DEFAULT_PROPS: CreateSetProps = {
    title: "",
    description: "",
    autoSaveTerms: initialTerms,
  };

  return createStore<CreateSetState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      addTerm: () =>
        set((state) => {
          const term: AutoSaveTerm = {
            id: nanoid(),
            word: "",
            definition: "",
            setAutoSaveId: "",
            rank: state.autoSaveTerms.length,
          };

          return {
            autoSaveTerms: [...state.autoSaveTerms, term],
          };
        }),
      bulkAddTerms: (terms: { word: string; definition: string }[]) => {
        set((state) => {
          const newTerms = terms.map((term, i) => ({
            id: nanoid(),
            word: term.word,
            definition: term.definition,
            setAutoSaveId: "",
            rank: state.autoSaveTerms.length + i,
          }));

          return {
            autoSaveTerms: [...state.autoSaveTerms, ...newTerms],
          };
        });
      },
      deleteTerm: (id: string) => {
        set((state) => {
          return {
            autoSaveTerms: state.autoSaveTerms.filter((term) => term.id !== id),
          };
        });
      },
      editTerm: (id: string, word: string, definition: string) => {
        set((state) => {
          return {
            autoSaveTerms: state.autoSaveTerms.map((t) =>
              t.id === id ? { ...t, word, definition } : t
            ),
          };
        });
      },
      reorderTerm: (id: string, rank: number) => {
        set((state) => {
          const term = state.autoSaveTerms.find((t) => t.id === id)!;

          const newTerms = state.autoSaveTerms.filter((t) => t.id !== id);
          newTerms.splice(rank, 0, term);

          return {
            autoSaveTerms: newTerms.map((t, i) => ({ ...t, rank: i })),
          };
        });
      },
      flipTerms: () => {
        set((state) => {
          return {
            autoSaveTerms: state.autoSaveTerms.map((term) => ({
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

export const CreateSetContext = React.createContext<CreateSetStore | null>(
  null
);

export const useCreateSetContext = <T>(
  selector: (state: CreateSetState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = React.useContext(CreateSetContext);
  if (!store) throw new Error("Missing CreateSetContext.Provider in the tree");

  return useStore(store, selector, equalityFn);
};
