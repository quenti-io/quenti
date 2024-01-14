import { Link } from "@quenti/components/link";
import type { User } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

import { useAssignment } from "../../../hooks/use-assignment";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { formatDueDate } from "../../../utils/time";
import { useAssignmentButton } from "./use-assignment-button";

export const AssignmentRightSide = () => {
  const isTeacher = useIsClassTeacher();

  if (!isTeacher) return <StudentSide />;
  return <TeacherSide />;
};

const TeacherSide = () => {
  const { data: class_ } = useClass();
  const { data: assignment } = useAssignment();
  const { data: studentData } = api.classes.getStudents.useQuery(
    {
      classId: class_!.id,
      sectionId: assignment?.section.id || "",
    },
    {
      enabled: !!assignment,
    },
  );

  if (!assignment) return null;

  const submitted =
    assignment.submissions?.filter((a) => a.submittedAt).length || 0;
  const assigned = assignment.section._count.students || 0;

  return (
    <Stack spacing="6">
      <VStack spacing="4">
        <HStack spacing="6">
          <Stack spacing="0">
            <Heading>{submitted}</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight={500}>
              Submitted
            </Text>
          </Stack>
          <Box
            h="full"
            w="2px"
            rounded="full"
            bg="gray.200"
            _dark={{
              bg: "gray.700",
            }}
          />
          <Stack spacing="0">
            <Heading>{assigned}</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight={500}>
              Assigned
            </Text>
          </Stack>
        </HStack>
        <Box
          w="full"
          h="2px"
          rounded="full"
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            rounded="full"
            w={`${(submitted / assigned) * 100}%`}
            h="full"
            transition="width ease-in-out 300ms"
            top="0"
            left="0"
            bg="blue.500"
            _dark={{
              bg: "blue.200",
            }}
          />
        </Box>
      </VStack>
      <SimpleGrid columns={5} spacing="4">
        {Array.from({ length: assigned }).map((_, i) => (
          <StudentAvatar
            key={i}
            user={studentData?.students[i]?.user}
            submitted={
              !!assignment.submissions?.find(
                (a) =>
                  a.submittedAt && a.member.id == studentData?.students[i]?.id,
              )
            }
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

const StudentAvatar: React.FC<{
  user?: Pick<User, "image" | "name" | "username">;
  submitted?: boolean;
}> = ({ user, submitted }) => {
  return (
    <Skeleton
      rounded="full"
      w="full"
      aspectRatio="1 / 1"
      isLoaded={!!user}
      position="relative"
      overflow="hidden"
    >
      <Link href={`/@${user?.username}`}>
        <Tooltip label={user?.name ?? user?.username}>
          <Avatar
            w="full"
            h="full"
            src={user?.image || ""}
            bg="gray.200"
            _dark={{
              bg: "gray.700",
            }}
            icon={<></>}
          />
        </Tooltip>
      </Link>
      <Box
        pointerEvents="none"
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        bg="gray.50"
        _dark={{
          bg: "gray.900",
        }}
        opacity={submitted ? 0 : 0.7}
        transition="opacity ease-in-out 200ms"
      />
    </Skeleton>
  );
};

const StudentSide = () => {
  const { data: class_ } = useClass();
  const { data: assignment } = useAssignment();

  const isLoaded = !!assignment && !!class_;

  const { label, Icon, variant, colorScheme, state } = useAssignmentButton({
    assignment,
    isTeacher: false,
  });

  return (
    <Stack spacing="3">
      <SkeletonText
        fitContent
        noOfLines={1}
        isLoaded={isLoaded}
        height="21px"
        w="max"
        maxW="full"
        skeletonHeight="14px"
        display="flex"
        alignItems="center"
      >
        <Text
          fontSize="xs"
          fontWeight={500}
          color="gray.700"
          _dark={{
            color: "gray.300",
          }}
        >
          {assignment?.submission?.submittedAt
            ? "Submitted "
            : assignment?.dueAt
              ? "Due "
              : ""}
          {assignment?.submission?.submittedAt || assignment?.dueAt
            ? formatDueDate(
                assignment?.submission?.submittedAt ?? assignment.dueAt!,
              )
            : "No due date"}
        </Text>
      </SkeletonText>
      <Skeleton rounded="lg" isLoaded={isLoaded}>
        <Button
          fontSize="sm"
          w="full"
          variant={variant}
          colorScheme={colorScheme}
          leftIcon={Icon ? <Icon size={18} /> : undefined}
          as={Link}
          href={
            state !== "locked"
              ? `/${assignment?.studySet?.id}/collab`
              : `/${assignment?.studySet?.id}`
          }
        >
          {label}
        </Button>
      </Skeleton>
    </Stack>
  );
};
