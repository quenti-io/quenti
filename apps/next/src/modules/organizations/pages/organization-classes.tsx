import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Button,
  Grid,
  GridItem,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconPlus, IconSchool } from "@tabler/icons-react";

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
      {org && classes?.length == 0 && (
        <Stack spacing="6">
          <Stack>
            <HStack spacing="4">
              <IconSchool size={32} />
              <Heading>No classes</Heading>
            </HStack>
            <Text color="gray.500">
              Create a class or invite teachers to your organization to get
              started.
            </Text>
          </Stack>
          <Button
            w="max"
            leftIcon={<IconPlus size={18} />}
            variant="outline"
            as={Link}
            href="/classes/new"
          >
            New class
          </Button>
        </Stack>
      )}
      <Grid
        templateColumns="repeat(auto-fill, minmax(256px, 1fr))"
        gap={4}
        pb="20"
      >
        {(isLoading || !org) &&
          Array.from({ length: 12 }).map((_, i) => (
            <GridItem h="170px" key={i}>
              <Skeleton
                rounded="lg"
                height="full"
                border="2px"
                borderColor="gray.700"
              />
            </GridItem>
          ))}
        {(classes || []).map((class_) => (
          <GridItem key={class_.id}>
            <ClassCard
              key={class_.id}
              id={class_.id}
              name={class_.name}
              bannerColor={class_.bannerColor}
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
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
