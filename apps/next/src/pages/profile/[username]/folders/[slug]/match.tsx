import { PageWrapper } from "../../../../../common/page-wrapper";
import { getLayout } from "../../../../../layouts/main-layout";
import { CreateMatchData } from "../../../../../modules/create-match-data";
import { HydrateFolderData } from "../../../../../modules/hydrate-folder-data";
import { MatchContainer } from "../../../../../modules/match/match-container";

const Match = () => {
  return (
    <HydrateFolderData withTerms disallowDirty>
      <CreateMatchData>
        <MatchContainer />
      </CreateMatchData>
    </HydrateFolderData>
  );
};

Match.PageWrapper = PageWrapper;
Match.getLayout = getLayout;

export default Match;
