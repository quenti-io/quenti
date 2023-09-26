import { CategoryBar, Flex, Icon, Legend, Metric, Text } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Skeleton } from "@chakra-ui/react";

import { IconUsers } from "@tabler/icons-react";

import { Card } from "../dashboard/card";

const OrganizationUsersRaw = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

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
    <Skeleton rounded="xl" isLoaded={!!data}>
      <Card>
        <Flex justifyContent="start" className="space-x-4">
          <Icon icon={IconUsers} variant="light" size="md" color="blue" />
          <div>
            <Text>Total users</Text>
            <Metric className="font-display">{students + teachers}</Metric>
          </div>
        </Flex>
        <CategoryBar
          className="mt-4"
          values={[students, teachers]}
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

export const OrganizationUsers = React.memo(OrganizationUsersRaw);
