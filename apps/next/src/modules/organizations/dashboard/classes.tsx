import { BarList, Flex, Icon, Metric, Text } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Skeleton } from "@chakra-ui/react";

import { IconSchool } from "@tabler/icons-react";

import { Card } from "../dashboard/card";

const OrganizationClassesRaw = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

  const { data } = api.organizations.getClassStatistics.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
    },
  );

  const consolidate = (
    data: RouterOutputs["organizations"]["getClassStatistics"],
  ) => {
    let total = 0;

    const consolidated = data.map((r) => ({
      name: r.category || "Other",
      value: r.count,
    }));

    const consolidatedMap = new Map<string, number>();
    consolidated.forEach((r) => {
      if (consolidatedMap.has(r.name)) {
        consolidatedMap.set(r.name, consolidatedMap.get(r.name)! + r.value);
      } else {
        consolidatedMap.set(r.name, r.value);
      }
      total += r.value;
    });

    const consolidatedArray = Array.from(consolidatedMap, ([name, value]) => ({
      name,
      value,
    }));

    return { consolidated: consolidatedArray, total };
  };

  const { consolidated, total } = consolidate(data || []);

  return (
    <Skeleton rounded="xl" isLoaded={!!data}>
      <Card>
        <Flex justifyContent="start" className="w-max space-x-4">
          <Icon icon={IconSchool} variant="light" size="md" color="blue" />
          <div>
            <Text>Classes</Text>
            <Metric className="font-display">{total}</Metric>
          </div>
        </Flex>
        <BarList data={consolidated} className="mt-4 h-56" />
      </Card>
    </Skeleton>
  );
};

export const OrganizationClasses = React.memo(OrganizationClassesRaw);
