import {
  Avatar,
  Box,
  Heading,
  HStack,
  Stack,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "@prisma/client";
import { IconRosetteFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { avatarUrl } from "../../utils/avatar";
import { formatDeciseconds, getRelativeTime } from "../../utils/time";

export interface LeaderboardEntryProps {
  rank: number;
  user: Pick<User, "id" | "username" | "image">;
  timestamp: Date;
  time: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  rank,
  user,
  timestamp,
  time,
}) => {
  const session = useSession();
  const isMyRank = session.data?.user?.id === user.id;

  const hoverBg = useColorModeValue("#17192306", "#F7FAFC06");

  return (
    <Box
      transition="background-color 0.2s ease-in-out"
      display="table-row"
      alignItems="center"
      rounded="md"
      py="2"
      _hover={{
        bg: hoverBg,
      }}
    >
      <Box
        px="4"
        verticalAlign="middle"
        minW="14"
        display="table-cell"
        position="relative"
        textAlign="center"
      >
        <RankIndicator rank={rank} />
        {isMyRank && (
          <Box
            position="absolute"
            top="0"
            left="0"
            h="full"
            w="1"
            bg="blue.300"
          />
        )}
      </Box>
      <Box w="full" display="table-cell" verticalAlign="middle">
        <HStack spacing="4">
          <Avatar src={avatarUrl(user)} width="40px" height="40px" />
          <Stack spacing="2px">
            <Text fontWeight={700}>{user.username}</Text>
            <Text color="gray.500" fontSize="xs">
              {getRelativeTime(timestamp)}
            </Text>
          </Stack>
        </HStack>
      </Box>
      <Box display="table-cell" verticalAlign="middle" pr="4">
        <Box display="flex" justifyContent="end">
          <Box
            w="max"
            h="full"
            bg="#4b83ff11"
            px="4"
            py="2"
            rounded="full"
            color="blue.300"
          >
            <Heading fontSize="lg">{`${formatDeciseconds(time)}s`}</Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const RankIndicator: React.FC<{ rank: number }> = ({ rank }) => {
  const bg = useColorModeValue("white", "gray.800");

  const first = useColorModeValue("yellow.400", "yellow.300");
  const second = useColorModeValue("orange.400", "orange.300");
  const third = useColorModeValue("gray.400", "gray.500");

  const rosetteColor = rank == 1 ? first : rank == 2 ? second : third;

  if (rank > 3) {
    return <Heading fontSize="sm">{rank}</Heading>;
  }

  return (
    <Box
      width="6"
      height="6"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={rosetteColor}
    >
      <IconRosetteFilled style={{ position: "absolute", top: 0, left: 0 }} />
      <Heading fontSize="xs" pt="2px" textColor={bg} zIndex="10">
        {rank}
      </Heading>
    </Box>
  );
};
