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
  terms: AutoSaveTerm[];
  termOrder: string[];
}

interface CreateSetState extends CreateSetProps {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addTerm: () => void;
  bulkAddTerms: (terms: { word: string; definition: string }[]) => void;
  deleteTerm: (id: string) => void;
  editTerm: (id: string, term: AutoSaveTerm) => void;
  reorderTerms: (termOrder: string[]) => void;
  flipTerms: () => void;
}

export type CreateSetStore = ReturnType<typeof createCreateSetStore>;

export const createCreateSetStore = (initProps?: Partial<CreateSetProps>) => {
  const DEFAULT_PROPS: CreateSetProps = {
    title: "",
    description: "",
    terms: initialTerms,
    termOrder: initialTerms.map((x) => x.id),
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
          };

          return {
            terms: [...state.terms, term],
            termOrder: [...state.termOrder, term.id],
          };
        }),
      bulkAddTerms: (terms: { word: string; definition: string }[]) => {
        set((state) => {
          const newTerms = terms.map((term) => ({
            id: nanoid(),
            word: term.word,
            definition: term.definition,
            setAutoSaveId: "",
          }));

          return {
            terms: [...state.terms, ...newTerms],
            termOrder: [...state.termOrder, ...newTerms.map((term) => term.id)],
          };
        });
      },
      deleteTerm: (id: string) => {
        set((state) => {
          return {
            terms: state.terms.filter((term) => term.id !== id),
            termOrder: state.termOrder.filter((termId) => termId !== id),
          };
        });
      },
      editTerm: (id: string, term: AutoSaveTerm) => {
        set((state) => {
          return {
            terms: state.terms.map((t) => (t.id === id ? term : t)),
          };
        });
      },
      reorderTerms: (termOrder: string[]) => set({ termOrder }),
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
