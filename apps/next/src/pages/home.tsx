import { Container, Stack } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import type { ComponentWithAuth } from "../components/auth-component";
import { Loading } from "../components/loading";
import { WithFooter } from "../components/with-footer";
import { useLoading } from "../hooks/use-loading";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { SetGrid } from "../modules/home/set-grid";

const Home: ComponentWithAuth = () => {
  const { data, isLoading } = api.recent.get.useQuery();
  const official = api.studySets.getOfficial.useQuery();

  const isEmpty = !data?.sets.length && !data?.folders.length;

  const { loading } = useLoading();
  if (loading) return <Loading />;

  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing={12}>
          {!isLoading && isEmpty && <EmptyDashboard />}
          {(isLoading || !isEmpty) && (
            <SetGrid
              data={data}
              isLoading={isLoading}
              heading="Recent"
              skeletonCount={16}
            />
          )}
          <SetGrid
            data={{ sets: official.data || [], folders: [] }}
            isLoading={official.isLoading}
            heading="Example Sets"
            skeletonCount={8}
            verified
          />
        </Stack>
      </Container>
    </WithFooter>
  );
};

Home.title = "Your Sets";
Home.authenticationEnabled = true;

export default Home;
