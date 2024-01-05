import { HeadSeo } from "@quenti/components/head-seo";

import { Container } from "@chakra-ui/react";

import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { WithFooter } from "../../../components/with-footer";
import { getLayout } from "../../../layouts/main-layout";
import { TermsListPure } from "../../../modules/editor/terms-list";
import { HydrateCollabData } from "../../../modules/hydrate-collab-data";

const Collab = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Collab" />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <HydrateCollabData>
              <TermsListPure />
            </HydrateCollabData>
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

Collab.PageWrapper = PageWrapper;
Collab.getLayout = getLayout;

export default Collab;
