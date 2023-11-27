import { api } from "@quenti/trpc";

import { Grid, Heading, Skeleton, Stack } from "@chakra-ui/react";

import { ClassesBeta } from "./news/v1.0.0/classes-beta";
import { IntroducingCortex } from "./news/v1.0.0/introducing-cortex";
import { Images } from "./news/v1.2.0/images";
import { RichText } from "./news/v1.2.0/rich-text";

export const News = () => {
  const { data } = api.recent.get.useQuery();

  if (!data) return null;

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">What&apos;s new</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        <Images />
        <RichText />
        <ClassesBeta />
        <IntroducingCortex />
      </Grid>
    </Stack>
  );
};
