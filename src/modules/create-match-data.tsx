import React from "react";
import { useSet } from "../hooks/use-set";
import {
  createMatchStore,
  MatchContext,
  type MatchStore,
} from "../stores/use-match-store";

export const CreateMatchData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, experience } = useSet();

  const storeRef = React.useRef<MatchStore>();
  if (!storeRef.current) {
    storeRef.current = createMatchStore();

    let isLeaderboardAllowed = true

    let learnTerms = terms

    if (experience.studyStarred) {
      learnTerms = terms.filter((x) =>
        experience.starredTerms.includes(x.id)
      );
      isLeaderboardAllowed = false
    }

    storeRef.current
      .getState()
      .initialize(
        learnTerms,
        isLeaderboardAllowed
      );
  }

  return (
    <MatchContext.Provider value={storeRef.current}>
      {children}
    </MatchContext.Provider>
  );
};
