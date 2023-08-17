import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/main-layout";
import { CreateMatchData } from "../../../modules/create-match-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { MatchContainer } from "../../../modules/match/match-container";

const Match = () => {
  return (
    <HydrateSetData disallowDirty requireFresh>
      <CreateMatchData>
        <MatchContainer />
      </CreateMatchData>
    </HydrateSetData>
  );
};

Match.PageWrapper = PageWrapper;
Match.getLayout = getLayout;

export default Match;
