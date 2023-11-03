import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";

import { Container } from "@chakra-ui/react";

import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { WithFooter } from "../../../components/with-footer";
import { useNonSetOwnerRedirect } from "../../../hooks/use-non-set-owner-redirect";
import { getLayout } from "../../../layouts/main-layout";

const InternalEditor = dynamic(
  () =>
    import("../../../modules/internal-editor").then(
      (mod) => mod.InternalEditor,
    ),
  { ssr: false },
);

const Edit = () => {
  useNonSetOwnerRedirect();

  return (
    <AuthedPage>
      <HeadSeo
        title="Edit Set"
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <InternalEditor />
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

Edit.PageWrapper = PageWrapper;
Edit.getLayout = getLayout;

export default Edit;
