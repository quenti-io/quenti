import {
  AreaChart,
  Flex,
  Metric,
  Tab,
  TabGroup,
  TabList,
  Text,
} from "@tremor/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Center,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Spinner,
  VStack,
  keyframes,
} from "@chakra-ui/react";

import { IconActivityHeartbeat, IconPointFilled } from "@tabler/icons-react";

import { useOrganization } from "../../../hooks/use-organization";
import { Card } from "./card";

const pulse = keyframes({
  "0%": { transform: "scale(0)", opacity: 1 },
  "50%": { transform: "scale(1)", opacity: 0.2 },
  "100%": { transform: "scale(2)", opacity: 0 },
});

const PERIODS = ["12h", "24h", "5d", "14d", "30d"] as const;

const placeholderData = [
  {
    time: "12:00",
    Students: 0,
    Teachers: 0,
  },
  {
    time: "13:00",
    Students: 10,
    Teachers: 12,
  },
  {
    time: "14:00",
    Students: 10,
    Teachers: 6,
  },
  {
    time: "15:00",
    Students: 4,
    Teachers: 6,
  },
  {
    time: "16:00",
    Students: 7,
    Teachers: 7,
  },
  {
    time: "17:00",
    Students: 10,
    Teachers: 0,
  },
];

const OrganizationActivityRaw = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

  const [activeUsers, setActiveUsers] = React.useState<number>(100);
  const [periodIndex, setPeriodIndex] = React.useState<number>(0);
  const [initialized, setInitialized] = React.useState(false);
  const [chartData, setChartData] = React.useState<
    ReturnType<typeof formatActivityData>
  >([]);

  const { data: orgData } = useOrganization();
  const { data, isLoading } = api.organizations.getActivity.useQuery(
    { id, period: PERIODS[periodIndex]! },
    {
      enabled: !!id && !!session.data?.user,
      refetchInterval: 60 * 1000,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  React.useEffect(() => {
    if (!initialized || !data) return;
    setActiveUsers(data?.total || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, data]);

  const formatActivityData = (
    activity: NonNullable<NonNullable<typeof data>["activity"]>,
  ) => {
    const data = activity.map((item) => {
      const period = PERIODS[periodIndex]!;
      const options: Intl.DateTimeFormatOptions =
        period == "12h"
          ? {
              hour: "numeric",
              minute: "2-digit",
            }
          : period == "24h"
            ? {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
              }
            : period == "5d"
              ? {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                }
              : {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                };

      const time = new Date(item.time).toLocaleTimeString(["en"], options);

      return {
        time,
        Students: item.activeStudents,
        Teachers: item.activeTeachers,
      };
    });

    return data;
  };

  React.useEffect(() => {
    if (isLoading || !data?.activity || !orgData) return;
    setChartData(formatActivityData(data.activity));
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, orgData]);

  return (
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
    >
      <Flex
        justifyContent="between"
        className="w-full flex-col items-start sm:flex-row sm:items-center"
      >
        <div className="space-y-1">
          <Flex alignItems="center" className="h-5">
            <SkeletonText
              noOfLines={1}
              skeletonHeight={3}
              isLoaded={initialized}
            >
              <Text>Active users</Text>
            </SkeletonText>
          </Flex>
          <Skeleton rounded="md" isLoaded={initialized}>
            <HStack spacing="1" ml="-6px">
              <Box color="green.400" position="relative">
                {initialized && (
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
                )}
                <IconPointFilled />
              </Box>
              <Metric className="font-display">{activeUsers}</Metric>
            </HStack>
          </Skeleton>
        </div>
        <div className="flex w-full justify-end sm:w-max">
          <TabGroup
            index={periodIndex}
            onIndexChange={setPeriodIndex}
            className="w-max"
          >
            <HStack spacing="3">
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={
                  isLoading && initialized
                    ? {
                        opacity: 1,
                      }
                    : {}
                }
              >
                <Spinner size="sm" color="blue.300" />
              </motion.div>
              <Skeleton rounded="lg" isLoaded={initialized}>
                <TabList color="gray" variant="solid">
                  {PERIODS.map((period, index) => (
                    <Tab key={index}>{period}</Tab>
                  ))}
                </TabList>
              </Skeleton>
            </HStack>
          </TabGroup>
        </div>
      </Flex>
      <Skeleton
        h="full"
        mt="8"
        rounded="xl"
        isLoaded={initialized}
        position="relative"
        overflow="hidden"
      >
        <AreaChart
          className="-ml-4 h-[436px] w-[calc(100%+16px)]"
          data={chartData.length > 1 ? chartData : placeholderData}
          index="time"
          categories={["Students", "Teachers"]}
          colors={["blue", "orange"]}
          showLegend={false}
          allowDecimals={false}
          showAnimation={true}
        />
        {initialized && chartData.length <= 1 && (
          <Center
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            className="bg-gray-50 bg-opacity-50 backdrop-blur-lg dark:bg-gray-900 dark:bg-opacity-50"
            rounded="xl"
            borderWidth="1px"
            borderColor="gray.200"
            _dark={{
              borderColor: "gray.750",
            }}
            p="10"
            textAlign="center"
          >
            <VStack>
              <HStack>
                <IconActivityHeartbeat />
                <Heading size="lg">No activity yet</Heading>
              </HStack>
              <Text>
                {!orgData?.published ? (
                  "Publish your organization to start collecting insights."
                ) : (
                  <>
                    Your organization doesn&apos;t have enough recorded activity
                    for this period.
                    <br />
                    Check back later.
                  </>
                )}
              </Text>
            </VStack>
          </Center>
        )}
      </Skeleton>
    </Card>
  );
};

export const OrganizationActivity = React.memo(OrganizationActivityRaw);
