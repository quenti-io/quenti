import React from "react";
import { useSet } from "../hooks/use-set";
import { LearnTerm } from "../interfaces/learn-term";
import {
  createLearnStore,
  LearnContext,
  type LearnStore,
} from "../stores/use-learn-store";

export const CreateLearnData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, termOrder, experience } = useSet();

  const storeRef = React.useRef<LearnStore>();
  if (!storeRef.current) {
    storeRef.current = createLearnStore();

    const sorted = terms.sort(
      (a, b) => termOrder.indexOf(a.id) - termOrder.indexOf(b.id)
    );
    const studiable = experience.studiableTerms;
    const learnTerms: LearnTerm[] = sorted.map((term) => {
      const studiableTerm = studiable.find((s) => s.id === term.id);
      return {
        ...term,
        correctness: studiableTerm?.correctness ?? 0,
        appearedInRound: studiableTerm?.appearedInRound,
      };
    });

    storeRef.current.getState().initialize(learnTerms, experience.learnRound);
  }

  return (
    <LearnContext.Provider value={storeRef.current}>
      {children}
    </LearnContext.Provider>
  );
};
