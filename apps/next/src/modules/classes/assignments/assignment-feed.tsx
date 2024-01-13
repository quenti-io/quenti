import React from "react";

import type { RouterOutputs } from "@quenti/trpc";

import {
  Box,
  Flex,
  HStack,
  Heading,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";

import { groupIntoTimeline } from "../../../utils/groupings";
import { AssignmentCard } from "./assignment-card";

export interface AssignmentFeedProps {
  classId: string;
  role: "Teacher" | "Student";
  assignments: RouterOutputs["assignments"]["feed"]["assignments"];
}

export const AssignmentFeed = ({
  classId,
  role,
  assignments,
}: AssignmentFeedProps) => {
  const grouped = groupIntoTimeline(assignments, "availableAt");

  return (
    <Stack spacing="6">
      {grouped.map((g, i) => (
        <React.Fragment key={i}>
          <HStack spacing="4">
            <Flex h="8" alignItems="center">
              <Heading fontSize="2xl" whiteSpace="nowrap">
                {g.label}
              </Heading>
            </Flex>
            <Box flex="1" h="2px" bg="gray.100" _dark={{ bg: "gray.750" }} />
          </HStack>
          <Stack spacing="4">
            {g.items.map((a) => (
              <AssignmentCard
                key={a.id}
                classId={classId}
                for={role}
                id={a.id}
                type={a.type}
                name={a.title}
                createdAt={a.createdAt}
                availableAt={a.availableAt}
                dueAt={a.dueAt}
                submissions={a.submissions}
                submission={a.submission}
                published={a.published}
                section={
                  a.section
                    ? {
                        id: a.section.id,
                        name: a.section.name,
                        students: a.section._count.students || 0,
                      }
                    : undefined
                }
              />
            ))}
          </Stack>
        </React.Fragment>
      ))}
    </Stack>
  );
};

AssignmentFeed.Skeleton = function AssignmentFeedSkeleton() {
  const Group = ({
    heading,
    assignments,
  }: {
    heading: string;
    assignments: number;
  }) => (
    <React.Fragment>
      <HStack spacing="4">
        <SkeletonText
          noOfLines={1}
          skeletonHeight="32px"
          rounded="md"
          overflow="hidden"
        >
          <Heading fontSize="2xl" whiteSpace="nowrap">
            {heading}
          </Heading>
        </SkeletonText>
        <Box flex="1" h="2px" bg="gray.100" _dark={{ bg: "gray.750" }} />
      </HStack>
      <Stack spacing="4">
        {Array.from({ length: assignments }, (_, i) => (
          <AssignmentCard.Skeleton key={i} />
        ))}
      </Stack>
    </React.Fragment>
  );

  return (
    <Stack spacing="6">
      <Group heading="Today" assignments={3} />
      <Group heading="Yesterday" assignments={2} />
    </Stack>
  );
};
