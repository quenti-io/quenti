import { Container, Stack } from "@chakra-ui/react";
import type { ComponentWithAuth } from "../components/auth-component";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { SetGrid } from "../modules/home/set-grid";
import { api } from "../utils/api";

const Home: ComponentWithAuth = () => {
  const { data, isLoading } = api.studySets.recent.useQuery({});
  const official = api.studySets.getOfficial.useQuery();

  return (
    <Container maxW="7xl" marginTop="10" marginBottom="20">
      <Stack spacing={12}>
        {!isLoading && !data?.length && <EmptyDashboard />}
        {(isLoading || data?.length) && (
          <SetGrid
            data={data}
            isLoading={isLoading}
            heading="Recent"
            skeletonCount={16}
          />
        )}
        <SetGrid
          data={official.data}
          isLoading={official.isLoading}
          heading="Example Sets"
          skeletonCount={8}
          verified
        />
      </Stack>
    </Container>
  );
};

Home.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Home;
