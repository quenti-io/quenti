import { BarList, Flex, Icon, Metric, Text } from "@tremor/react";

import { Skeleton } from "@chakra-ui/react";

import { IconSchool } from "@tabler/icons-react";

import { useOrganization } from "../../../hooks/use-organization";
import { Card } from "../dashboard/card";

const cities = [
  {
    name: "San Francisco",
    value: 3000,
  },
  {
    name: "Singapore",
    value: 1908,
  },
  {
    name: "King",
    value: 1908,
  },
  {
    name: "Zurich",
    value: 1398,
  },
];

export const OrganizationClasses = () => {
  const { data: org } = useOrganization();

  return (
    <Skeleton rounded="xl" isLoaded={!!org}>
      <Card>
        <Flex justifyContent="start" className="w-max space-x-4">
          <Icon icon={IconSchool} variant="light" size="md" color="blue" />
          <div>
            <Text>Classes</Text>
            <Metric className="font-display">65</Metric>
          </div>
        </Flex>
        <BarList data={cities} className="mt-4" />
      </Card>
    </Skeleton>
  );
};
