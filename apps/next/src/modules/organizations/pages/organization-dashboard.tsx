import {
  Card,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useOrganization } from "../../../hooks/use-organization";

export const OrganizationDashboard = () => {
  const { data: org } = useOrganization();

  return (
    <Container maxW="6xl">
      <SimpleGrid columns={3}>
        <Card bg="gray.750" rounded="xl" py="4" px="8">
          <Stack spacing="4">
            <Stack spacing="0">
              <Text color="gray.500" fontWeight={600} fontSize="sm">
                Students
              </Text>
              <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}>
                {org?._count.users || 0}
              </Heading>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  );
};
