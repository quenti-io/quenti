import { Link } from "@quenti/components/link";
import type { AssignmentType } from "@quenti/prisma/client";

import {
  Box,
  Card,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconArrowRight,
  IconCircleCheck,
  IconProgress,
  IconSlash,
  IconUsers,
} from "@tabler/icons-react";

import { formatDueDate } from "../../../utils/time";
import { CollabIcon } from "./collab-icon";

export interface AssignmentCardProps {
  for: "Teacher" | "Student";
  classId: string;
  id: string;
  type: AssignmentType;
  name: string;
  createdAt: Date;
  availableAt: Date;
  dueAt: Date | null;
  published?: boolean;
  submissions?: number;
  section?: {
    id: string;
    name: string;
    students: number;
  };
  submission?: {
    id: string;
    startedAt: Date;
    submittedAt: Date | null;
  };
}

export const AssignmentCard = (props: AssignmentCardProps) => {
  return (
    <LinkBox
      px="5"
      py="4"
      bg="white"
      borderColor="gray.100"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
      _dark={{
        borderColor: "gray.700",
        bg: "gray.800",
        _hover: {
          borderBottomColor: "blue.300",
        },
      }}
      rounded="lg"
      borderWidth="2px"
      shadow="md"
      sx={{
        "&:has(:focus-visible)": {
          borderColor: "blue.300",
          transform: "translateY(-2px)",
          _dark: {
            borderColor: "blue.300",
          },
        },
      }}
      transition="all ease-in-out 150ms"
      role="group"
    >
      <HStack
        display={{
          base: "flex",
          md: "none",
        }}
        mb="3"
        ml="-6px"
      >
        <CollabIcon size={24} />
        <Heading fontSize="lg">
          <LinkOverlay
            href={`/a/${props.classId}/${props.id}`}
            as={Link}
            _focus={{
              outline: "none",
            }}
          >
            {props.name}
          </LinkOverlay>
        </Heading>
      </HStack>
      <HStack justifyContent="space-between">
        <HStack spacing="4">
          <Box display={{ base: "none", md: "flex" }}>
            <CollabIcon />
          </Box>
          <Stack spacing="1">
            <Flex
              minH="24px"
              alignItems="center"
              display={{
                base: "none",
                md: "flex",
              }}
            >
              <Heading fontSize="lg">
                <LinkOverlay
                  href={`/a/${props.classId}/${props.id}`}
                  as={Link}
                  _focus={{
                    outline: "none",
                  }}
                >
                  {props.name}
                </LinkOverlay>
              </Heading>
            </Flex>
            <HStack
              spacing={{ base: 1, md: 3 }}
              alignItems={{ base: "flex-start", md: "center" }}
              flexDir={{
                base: "column",
                md: "row",
              }}
            >
              {props.for == "Teacher" && (
                <HStack
                  color={props.published ? "green.500" : "gray.500"}
                  spacing="6px"
                  fontWeight={props.published ? 500 : 400}
                  _dark={{
                    color: props.published ? "green.300" : "gray.500",
                  }}
                >
                  {props.published ? (
                    <IconCircleCheck size={14} />
                  ) : (
                    <IconProgress size={14} />
                  )}
                  <Text fontSize="sm">
                    {props.published ? "Published" : "Unpublished"}
                  </Text>
                </HStack>
              )}
              <HStack
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
                spacing="6px"
              >
                {props.for == "Teacher" && <IconUsers size={14} />}
                <Text fontSize="sm">
                  {props.for == "Teacher"
                    ? props.section?.name || "Section"
                    : props.dueAt
                      ? `Due ${formatDueDate(props.dueAt)}`
                      : "No due date"}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </HStack>
        {props.for == "Teacher" ? (
          <Stack>
            <HStack spacing="2px">
              <Heading fontSize="md">{props.submissions || 0}</Heading>
              <Box
                transform="rotate(-20deg)"
                color="gray.700"
                _dark={{
                  color: "gray.300",
                }}
              >
                <IconSlash size={14} stroke={3} />
              </Box>
              <Heading fontSize="md">{props.section?.students || 0}</Heading>
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
                w={`${
                  ((props.submissions || 0) / (props.section?.students || 0)) *
                  100
                }%`}
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
          </Stack>
        ) : (
          <HStack
            color={props.submission?.submittedAt ? "gray.400" : "gray.600"}
            _dark={{
              color: props.submission?.submittedAt ? "gray.500" : "gray.400",
            }}
            fontSize="sm"
            fontWeight={600}
          >
            <Text>
              {props.submission?.submittedAt
                ? "Submitted"
                : props.submission?.startedAt
                  ? "In progress"
                  : "Not started"}
            </Text>
            {props.submission?.submittedAt ? (
              <IconCircleCheck size={18} />
            ) : (
              <Box
                w="18px"
                h="18px"
                overflow="hidden"
                position="relative"
                rounded="full"
              >
                <Stack
                  spacing="0"
                  _groupHover={{
                    transform: "translateY(-18px)",
                  }}
                  transition="transform ease-in-out 300ms"
                >
                  <Box
                    opacity={1}
                    _groupHover={{
                      opacity: 0,
                    }}
                    transition="opacity ease-in-out 300ms"
                  >
                    <IconProgress size={18} />
                  </Box>
                  <Box
                    opacity={0}
                    _groupHover={{
                      opacity: 1,
                    }}
                    transition="opacity ease-in-out 300ms"
                  >
                    <IconArrowRight size={18} />
                  </Box>
                </Stack>
              </Box>
            )}
          </HStack>
        )}
      </HStack>
    </LinkBox>
  );
};

AssignmentCard.Skeleton = function AssignmentCardSkeleton() {
  return (
    <Card
      px="5"
      py="4"
      bg="white"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
        bg: "gray.800",
      }}
      rounded="lg"
      borderWidth="2px"
      shadow="md"
    >
      <HStack spacing="4">
        <Skeleton w="44px" h="44px" rounded="full" />
        <Stack spacing="1">
          <SkeletonText
            rounded="lg"
            fitContent
            variant="refined"
            noOfLines={1}
            display="flex"
            alignItems="center"
            skeletonHeight={18}
            h="6"
          >
            <Heading fontSize="lg">Assignment Title Placeholder</Heading>
          </SkeletonText>
          <HStack spacing="3">
            <SkeletonText
              rounded="lg"
              fitContent
              variant="refined"
              noOfLines={1}
              display="flex"
              alignItems="center"
              skeletonHeight="14px"
              h="21px"
            >
              <Text fontSize="sm">Dec 31, 1969</Text>
            </SkeletonText>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
