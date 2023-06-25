import type { ComponentWithAuth } from "../../../../../components/auth-component";
import { CreateMatchData } from "../../../../../modules/create-match-data";
import { HydrateFolderData } from "../../../../../modules/hydrate-folder-data";
import { MatchContainer } from "../../../../../modules/match/match-container";

const Match: ComponentWithAuth = () => {
  return (
    <HydrateFolderData withTerms>
      <CreateMatchData>
        <MatchContainer />;
      </CreateMatchData>
    </HydrateFolderData>
  );
};

Match.authenticationEnabled = true;

export default Match;
