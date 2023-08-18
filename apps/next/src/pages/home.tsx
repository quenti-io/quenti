import { HeadSeo } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Container, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { WithFooter } from "../components/with-footer";
import { getLayout } from "../layouts/main-layout";
import { ClassesGrid } from "../modules/home/classes-grid";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { SetGrid } from "../modules/home/set-grid";

const Home = () => {
  const { data, isLoading } = api.recent.get.useQuery();
  const isEmpty = !data?.sets.length && !data?.folders.length;

  return (
    <>
      <HeadSeo title="Home" />
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={12}>
            {!isLoading && isEmpty && <EmptyDashboard />}
            <SetGrid />
            <ClassesGrid />
          </Stack>
        </Container>
      </WithFooter>
    </>
  );
};

Home.getLayout = getLayout;
Home.PageWrapper = PageWrapper;

export default Home;
