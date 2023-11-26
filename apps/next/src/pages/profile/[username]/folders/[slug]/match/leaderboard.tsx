import { HeadSeo } from "@quenti/components/head-seo";

import { LazyWrapper } from "../../../../../../common/lazy-wrapper";
import { PageWrapper } from "../../../../../../common/page-wrapper";
import { AuthedPage } from "../../../../../../components/authed-page";
import { getLayout } from "../../../../../../layouts/main-layout";
import { CreateMatchData } from "../../../../../../modules/create-match-data";
import { HydrateFolderData } from "../../../../../../modules/hydrate-folder-data";
import { MatchSummary } from "../../../../../../modules/match/match-summary";

const MatchLeaderboard = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Leaderboard - Match" />
      <LazyWrapper>
        <HydrateFolderData withTerms disallowDirty>
          <CreateMatchData>
            <MatchSummary />
          </CreateMatchData>
        </HydrateFolderData>
      </LazyWrapper>
    </AuthedPage>
  );
};

MatchLeaderboard.PageWrapper = PageWrapper;
MatchLeaderboard.getLayout = getLayout;

export default MatchLeaderboard;
