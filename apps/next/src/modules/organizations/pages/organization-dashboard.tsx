import {
  AreaChart,
  BarList,
  CategoryBar,
  Col,
  Flex,
  Grid,
  Icon,
  Legend,
  Metric,
  Tab,
  TabGroup,
  TabList,
  Text,
} from "@tremor/react";

import { Box, Container, HStack, Stack, keyframes } from "@chakra-ui/react";

import { IconPointFilled, IconSchool, IconUsers } from "@tabler/icons-react";

import { Card } from "../dashboard/card";
import { OrgDisplay } from "../org-display";

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

const chartdata = [
  {
    date: "Jan 22",
    SemiAnalysis: 2890,
    "The Pragmatic Engineer": 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    "The Pragmatic Engineer": 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    "The Pragmatic Engineer": 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    "The Pragmatic Engineer": 218,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    "The Pragmatic Engineer": 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    "The Pragmatic Engineer": 1726,
  },
  {
    date: "Jul 22",
    SemiAnalysis: 3122,
    "The Pragmatic Engineer": 1700,
  },
];

const pulse = keyframes({
  "0%": { transform: "scale(0)", opacity: 1 },
  "50%": { transform: "scale(1)", opacity: 0.2 },
  "100%": { transform: "scale(2)", opacity: 0 },
});

export const OrganizationDashboard = () => {
  // const { data: org } = useOrganization();

  return (
    <Container maxW="6xl" h="100vh">
      <Stack spacing="6">
        <OrgDisplay />
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="mt-6 gap-6">
          <Col numColSpan={2} className="h-[500]">
            <Card
              p="0"
              h="full"
              shadow="none"
              bg="none"
              border="none"
              _dark={{
                bg: "none",
                border: "none",
              }}
              w="calc(100% + 16px)"
              ml="-4"
            >
              <Flex
                className="ml-4 w-[calc(100%-16px)]"
                justifyContent="between"
              >
                <div className="space-y-1">
                  <Text>Active users</Text>
                  <HStack spacing="1" ml="-6px">
                    <Box color="green.400" position="relative">
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        bg="green.400"
                        w="full"
                        h="full"
                        rounded="full"
                        opacity="0.3"
                        animation={`${pulse} 4s ease infinite`}
                      />
                      <IconPointFilled />
                    </Box>
                    <Metric className="font-display">87</Metric>
                  </HStack>
                </div>
                <TabGroup
                  index={0}
                  onIndexChange={() => undefined}
                  className="w-max"
                >
                  <TabList color="gray" variant="solid">
                    <Tab>12h</Tab>
                    <Tab>24h</Tab>
                    <Tab>5d</Tab>
                  </TabList>
                </TabGroup>
              </Flex>
              <AreaChart
                className="ml-0 mt-8 h-full pl-0"
                data={chartdata}
                index="date"
                categories={["SemiAnalysis", "The Pragmatic Engineer"]}
                colors={["blue", "orange"]}
                showLegend={false}
                // valueFormatter={dataFormatter}
              />
            </Card>
          </Col>
          <Col numColSpan={1} className="space-y-6">
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
            <Card>
              <Flex justifyContent="start" className="w-max space-x-4">
                <Icon
                  icon={IconSchool}
                  variant="light"
                  size="md"
                  color="blue"
                />
                <div>
                  <Text>Classes</Text>
                  <Metric className="font-display">65</Metric>
                </div>
              </Flex>
              <BarList data={cities} className="mt-4" />
            </Card>
          </Col>
        </Grid>
      </Stack>
    </Container>
  );
};
