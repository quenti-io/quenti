import { CategoryBar, Flex, Icon, Legend, Metric, Text } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Box, Skeleton } from "@chakra-ui/react";

import { IconUsers } from "@tabler/icons-react";

import { useOrganization } from "../../../hooks/use-organization";
import { plural } from "../../../utils/string";
import { Card } from "../dashboard/card";

const OrganizationUsersRaw = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

  const { data: org } = useOrganization();
  const { data } = api.organizations.getUserStatistics.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
    },
  );

  const consolidate = (
    input: RouterOutputs["organizations"]["getUserStatistics"],
  ) => {
    let students = 0;
    let teachers = 0;

    input.forEach((r) => {
      if (r.type === "Student") {
        students += r.count;
      } else {
        teachers += r.count;
      }
    });

    return { students, teachers };
  };

  const { students, teachers } = consolidate(data || []);

  return (
    <Skeleton rounded="xl" isLoaded={!!data && !!org}>
      <Card>
        <Flex justifyContent="start" className="space-x-4">
          <Icon icon={IconUsers} variant="light" size="md" color="blue" />
          <div>
            <Text>Total users</Text>
            <Metric className="font-display">
              {(students + teachers).toLocaleString()}
            </Metric>
          </div>
        </Flex>
        <Box mt="4" h="9">
          {org?.published ? (
            <div className="space-y-2">
              <Flex justifyContent="between">
                <Text>
                  {plural(students, "student", { toLocaleString: true })}
                </Text>
                <Text>
                  {plural(teachers, "teacher", { toLocaleString: true })}
                </Text>
              </Flex>
              <CategoryBar
                values={[
                  (students / (students + teachers)) * 100,
                  (teachers / (students + teachers)) * 100,
                ]}
                colors={["blue", "orange"]}
                showLabels={false}
              />
            </div>
          ) : (
            <Text>
              Your organization needs to be published before you can enroll
              users.
            </Text>
          )}
        </Box>
        <Legend
          className="mt-3"
          categories={["Students", "Teachers"]}
          colors={["blue", "orange"]}
        />
      </Card>
    </Skeleton>
  );
};

export const OrganizationUsers = React.memo(OrganizationUsersRaw);
