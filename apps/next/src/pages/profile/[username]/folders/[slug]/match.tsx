import { HeadSeo } from "@quenti/components";

import { PageWrapper } from "../../../../../common/page-wrapper";
import { AuthedPage } from "../../../../../components/authed-page";
import { getLayout } from "../../../../../layouts/main-layout";
import { CreateMatchData } from "../../../../../modules/create-match-data";
import { HydrateFolderData } from "../../../../../modules/hydrate-folder-data";
import { MatchContainer } from "../../../../../modules/match/match-container";

const Match = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Match" />
      <HydrateFolderData withTerms disallowDirty>
        <CreateMatchData>
          <MatchContainer />
        </CreateMatchData>
      </HydrateFolderData>
    </AuthedPage>
  );
};

Match.PageWrapper = PageWrapper;
Match.getLayout = getLayout;

export default Match;
