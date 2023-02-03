import {
  Container,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import type { ComponentWithAuth } from "../components/auth-component";
import { StudySetCard } from "../components/study-set-card";
import { api } from "../utils/api";

const Home: ComponentWithAuth = () => {
  const { data: session } = useSession();

  const { data, isLoading } = api.studySets.recent.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const headingColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="7xl" marginTop="10">
      <Stack spacing={6}>
        <Heading color={headingColor} size="md">
          Recent
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {isLoading &&
            Array.from({ length: 9 }).map((_, i) => (
              <GridItem minHeight="36" key={i}>
                <Skeleton
                  rounded="md"
                  height="full"
                  border="2px"
                  borderColor="gray.700"
                />
              </GridItem>
            ))}
          {(data || []).map((studySet) => (
            <GridItem key={studySet.id}>
              <StudySetCard
                studySet={studySet}
                numTerms={studySet._count.terms}
                user={studySet.user}
              />
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

Home.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Home;
