import { Container, Stack } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import type { ComponentWithAuth } from "../components/auth-component";
import { WithFooter } from "../components/with-footer";
import { ClassesGrid } from "../modules/home/classes-grid";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { SetGrid } from "../modules/home/set-grid";

const Home: ComponentWithAuth = () => {
  const { data, isLoading } = api.recent.get.useQuery();
  const isEmpty = !data?.sets.length && !data?.folders.length;

  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing={12}>
          {!isLoading && isEmpty && <EmptyDashboard />}
          <SetGrid />
          <ClassesGrid />
        </Stack>
      </Container>
    </WithFooter>
  );
};

Home.title = "Your Sets";
Home.authenticationEnabled = true;

export default Home;
