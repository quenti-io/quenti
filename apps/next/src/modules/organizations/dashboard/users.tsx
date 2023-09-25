import { CategoryBar, Flex, Icon, Legend, Metric, Text } from "@tremor/react";

import { Skeleton } from "@chakra-ui/react";

import { IconUsers } from "@tabler/icons-react";

import { useOrganization } from "../../../hooks/use-organization";
import { Card } from "../dashboard/card";

export const OrganizationUsers = () => {
  const { data: org } = useOrganization();

  return (
    <Skeleton rounded="xl" isLoaded={!!org}>
      <Card>
        <Flex justifyContent="start" className="space-x-4">
          <Icon icon={IconUsers} variant="light" size="md" color="blue" />
          <div>
            <Text>Total users</Text>
            <Metric className="font-display">10,483</Metric>
          </div>
        </Flex>
        <CategoryBar
          className="mt-4"
          values={[6724, 3621]}
          colors={["blue", "orange"]}
        />
        <Legend
          className="mt-3"
          categories={["Students", "Teachers"]}
          colors={["blue", "orange"]}
        />
      </Card>
    </Skeleton>
  );
};
