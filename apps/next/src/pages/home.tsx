import { useSession } from "next-auth/react";

import { HeadSeo } from "@quenti/components/head-seo";
import { api } from "@quenti/trpc";

import { Container, Stack } from "@chakra-ui/react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { WithFooter } from "../components/with-footer";
import { getLayout } from "../layouts/main-layout";
import { ClassesGrid } from "../modules/home/classes-grid";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { News } from "../modules/home/news";
import { SetGrid } from "../modules/home/set-grid";

const Home = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery();
  const isEmpty = !data?.entities.length;

  const isLoading = status == "unauthenticated" || recentLoading;

  return (
    <AuthedPage>
      <HeadSeo title="Home" />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <Stack spacing={12}>
              {!isLoading && isEmpty && <EmptyDashboard />}
              <SetGrid />
              <ClassesGrid />
              <News />
            </Stack>
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

Home.getLayout = getLayout;
Home.PageWrapper = PageWrapper;

export default Home;
