import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";

import { Container } from "@chakra-ui/react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { WithFooter } from "../components/with-footer";
import { getLayout } from "../layouts/main-layout";

const InternalCreate = dynamic(
  () => import("../modules/internal-create").then((mod) => mod.InternalCreate),
  { ssr: false },
);

const Create = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Create a new set" />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <InternalCreate />
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

Create.PageWrapper = PageWrapper;
Create.getLayout = getLayout;

export default Create;
