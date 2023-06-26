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

  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("#17192306", "#F7FAFC06");
  const rosetteColor =
    rank == 1 ? "yellow.300" : rank == 2 ? "orange.300" : "gray.300";

  const myRank = session.data?.user?.id === user.id;

  return (
    <Tr
      transition="background-color 0.2s ease-in-out"
      roundedRight="lg"
      roundedLeft={!myRank ? "lg" : undefined}
      boxShadow={
        myRank
          ? "0 0px 25px -5px rgba(0, 0, 0, 0.3), 0 0px 10px -5px rgba(0, 0, 0, 0.1)"
          : undefined
      }
      _hover={{
        bg: hoverBg,
      }}
    >
      <Td
        py="3"
        pr="4"
        paddingInlineStart="4"
        borderLeft="4px solid"
        borderLeftColor={myRank ? "blue.300" : "transparent"}
      >
        <Box
          width="6"
          height="6"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={rosetteColor}
        >
          <IconRosetteFilled
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <Heading fontSize="xs" pt="2px" textColor={bg} zIndex="10">
            {rank}
          </Heading>
        </Box>
      </Td>
      <Td w="full" px="0" py="3">
        <HStack spacing="4">
          <Avatar src={avatarUrl(user)} width="40px" height="40px" />
          <Stack spacing="2px">
            <Text fontWeight={700}>{user.username}</Text>
            <Text color="gray.500" fontSize="xs">
              {getRelativeTime(timestamp)}
            </Text>
          </Stack>
        </HStack>
      </Td>
      <Td py="3">
        <Box
          w="full"
          h="full"
          bg="#4b83ff11"
          px="4"
          py="2"
          rounded="full"
          color="blue.300"
        >
          <Heading fontSize="lg">{`${formatDeciseconds(time)}s`}</Heading>
        </Box>
      </Td>
    </Tr>
  );
};
