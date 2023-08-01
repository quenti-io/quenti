import type { ComponentWithAuth } from "../../../components/auth-component";
import { CreateMatchData } from "../../../modules/create-match-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { MatchContainer } from "../../../modules/match/match-container";

const Match: ComponentWithAuth = () => {
  return (
    <HydrateSetData disallowDirty requireFresh>
      <CreateMatchData>
        <MatchContainer />
      </CreateMatchData>
    </HydrateSetData>
  );
};

Match.authenticationEnabled = true;

export default Match;
