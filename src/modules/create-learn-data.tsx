import React from "react";
import { useSet } from "../hooks/use-set";
import type { LearnTerm } from "../interfaces/learn-term";
import {
  createLearnStore,
  LearnContext,
  type LearnStore,
} from "../stores/use-learn-store";

export const CreateLearnData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, experience } = useSet();

  const storeRef = React.useRef<LearnStore>();
  if (!storeRef.current) {
    storeRef.current = createLearnStore();

    const studiable = experience.studiableTerms;

    let learnTerms: LearnTerm[] = terms
      .sort((a, b) => a.rank - b.rank)
      .map((term) => {
        const studiableTerm = studiable.find((s) => s.id === term.id);
        return {
          ...term,
          correctness: studiableTerm?.correctness ?? 0,
          appearedInRound: studiableTerm?.appearedInRound,
          incorrectCount: studiableTerm?.incorrectCount ?? 0,
        };
      });

    if (experience.studyStarred) {
      learnTerms = learnTerms.filter((x) =>
        experience.starredTerms.includes(x.id)
      );
    }

    storeRef.current.getState().initialize(learnTerms, experience.learnRound);
  }

  return (
    <LearnContext.Provider value={storeRef.current}>
      {children}
    </LearnContext.Provider>
  );
};
