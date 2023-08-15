import React from "react";

import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { useContainerContext } from "../stores/use-container-store";
import {
  MatchContext,
  type MatchStore,
  createMatchStore,
} from "../stores/use-match-store";

export const CreateMatchData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms } = useSetFolderUnison();
  const starredTerms = useContainerContext((s) => s.starredTerms);
  const matchStudyStarred = useContainerContext((s) => s.matchStudyStarred);

  const storeRef = React.useRef<MatchStore>();
  if (!storeRef.current) {
    storeRef.current = createMatchStore();

    let isLeaderboardAllowed = true;
    let learnTerms = terms;

    if (matchStudyStarred) {
      learnTerms = terms.filter((x) => starredTerms.includes(x.id));
      isLeaderboardAllowed = false;
    }

    storeRef.current.getState().initialize(learnTerms, isLeaderboardAllowed);
  }

  return (
    <MatchContext.Provider value={storeRef.current}>
      {children}
    </MatchContext.Provider>
  );
};
