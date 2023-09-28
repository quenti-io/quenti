import { api } from "@quenti/trpc";

import { Grid, GridItem, Skeleton, Stack } from "@chakra-ui/react";

import { ClassCard } from "../../../components/class-card";
import { useOrganization } from "../../../hooks/use-organization";

export const OrganizationClasses = () => {
  const { data: org } = useOrganization();

  const { data: classes, isLoading } = api.organizations.getClasses.useQuery(
    { orgId: org?.id || "" },
    {
      enabled: !!org,
    },
  );

  return (
    <Stack spacing="6">
      <Grid
        templateColumns="repeat(auto-fill, minmax(256px, 1fr))"
        gap={4}
        pb="20"
      >
        {(isLoading || !org) &&
          Array.from({ length: 12 }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <Skeleton
                rounded="lg"
                height="full"
                border="2px"
                borderColor="gray.700"
              />
            </GridItem>
          ))}
        {(classes || []).map((class_) => (
          <ClassCard
            key={class_.id}
            id={class_.id}
            name={class_.name}
            data={{
              students: class_._count.members || 0,
              sections: class_._count.sections || 0,
              folders: 0,
              studySets: 0,
            }}
            for="Teacher"
            logo={class_.logoUrl}
            hash={class_.logoHash}
          />
        ))}
      </Grid>
    </Stack>
  );
};
