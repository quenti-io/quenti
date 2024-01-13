import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import { Container, Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../../../common/editor-global-styles";
import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { SearchImagesModal } from "../../../components/search-images-modal";
import { WithFooter } from "../../../components/with-footer";
import { editorEventChannel } from "../../../events/editor";
import { getLayout } from "../../../layouts/main-layout";
import { CollabSetInfo } from "../../../modules/collab/collab-set-info";
import { CollabTopBar } from "../../../modules/collab/collab-top-bar";
import { TermsListPure } from "../../../modules/editor/terms-list";
import { HydrateCollabData } from "../../../modules/hydrate-collab-data";

const Collab = () => {
  const [searchImagesOpen, setSearchImagesOpen] = React.useState(false);

  React.useEffect(() => {
    const open = () => setSearchImagesOpen(true);

    editorEventChannel.on("openSearchImages", open);
    return () => {
      editorEventChannel.off("openSearchImages", open);
    };
  }, []);

  return (
    <AuthedPage>
      <HeadSeo title="Collab" />
      <LazyWrapper>
        <EditorGlobalStyles />
        <WithFooter>
          <Container maxW="7xl">
            <HydrateCollabData>
              <SearchImagesModal
                isOpen={searchImagesOpen}
                onClose={() => {
                  setSearchImagesOpen(false);
                }}
              />
              <Stack spacing="8">
                <CollabTopBar />
                <CollabSetInfo />
                <TermsListPure />
              </Stack>
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
