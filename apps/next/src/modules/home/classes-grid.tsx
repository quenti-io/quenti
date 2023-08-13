import { Grid, GridItem, Heading, Skeleton, Stack } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { ClassCard } from "../../components/class-card";

export const ClassesGrid = () => {
  const { data, isLoading } = api.recent.get.useQuery();

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">Your classes</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <Skeleton
                rounded="lg"
                height="full"
                border="2px"
                borderColor="gray.700"
              />
            </GridItem>
          ))}
        {(data?.classes || []).map((class_) => (
          <ClassCard
            key={class_.id}
            id={class_.id}
            name={class_.name}
            data={{
              students: class_._count.members || 0,
              sections: class_._count.sections || 0,
              folders: class_._count.folders || 0,
              studySets: class_._count.studySets || 0,
            }}
            for={class_.as}
          />
        ))}
      </Grid>
    </Stack>
  );
};
