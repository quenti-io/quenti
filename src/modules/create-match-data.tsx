import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { useExperienceContext } from "../stores/use-experience-store";
import {
  createMatchStore,
  MatchContext,
  type MatchStore,
} from "../stores/use-match-store";

export const CreateMatchData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms } = useSetFolderUnison();
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const matchStudyStarred = useExperienceContext((s) => s.matchStudyStarred);

  const storeRef = React.useRef<MatchStore>();
  if (!storeRef.current) {
    storeRef.current = createMatchStore();

    let isLeaderboardAllowed = true;
    let learnTerms = terms;
    console.log("matchStudyStarred", matchStudyStarred);

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
