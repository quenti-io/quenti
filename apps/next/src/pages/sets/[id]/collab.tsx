import { HeadSeo } from "@quenti/components/head-seo";

import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { getLayout } from "../../../layouts/main-layout";
import { HydrateCollabData } from "../../../modules/hydrate-collab-data";

const Collab = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Collab" />
      <LazyWrapper>
        <HydrateCollabData />
      </LazyWrapper>
    </AuthedPage>
  );
};

Collab.PageWrapper = PageWrapper;
Collab.getLayout = getLayout;

export default Collab;
