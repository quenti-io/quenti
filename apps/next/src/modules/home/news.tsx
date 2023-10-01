import { api } from "@quenti/trpc";

import { Grid, Heading, Skeleton, Stack } from "@chakra-ui/react";

import { ClassesBeta } from "./news/classes-beta";
import { IntroducingCortex } from "./news/introducing-cortex";
import { Quenti10 } from "./news/quenti-1.0";
import { TestAndMatch } from "./news/test-and-match";

export const News = () => {
  const { data } = api.recent.get.useQuery();

  if (!data) return null;

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">What&apos;s new</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        <Quenti10 />
        <ClassesBeta />
        <IntroducingCortex />
        <TestAndMatch />
      </Grid>
    </Stack>
  );
};
