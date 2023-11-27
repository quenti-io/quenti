import { HeadSeo } from "@quenti/components/head-seo";

import { EditorGlobalStyles } from "../../../../../common/editor-global-styles";
import { LazyWrapper } from "../../../../../common/lazy-wrapper";
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
      <LazyWrapper>
        <EditorGlobalStyles small />
        <HydrateFolderData withTerms disallowDirty>
          <CreateMatchData>
            <MatchContainer />
          </CreateMatchData>
        </HydrateFolderData>
      </LazyWrapper>
    </AuthedPage>
  );
};

Match.PageWrapper = PageWrapper;
Match.getLayout = getLayout;

export default Match;
