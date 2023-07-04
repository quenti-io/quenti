import {
  Avatar,
  Box,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { Link } from "../../components/link";
import { useSet, useSetReady } from "../../hooks/use-set";
import { avatarUrl } from "../../utils/avatar";
import { ActionArea } from "./action-area";

export const DescriptionArea = () => {
  const ready = useSetReady();
  const { description, user } = useSet();
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack spacing={8}>
      <Flex
        justifyContent={{ base: "start", sm: "space-between" }}
        flexDir={{ base: "column", sm: "row" }}
        gap={{ base: 8, sm: 0 }}
      >
        <HStack spacing={4}>
          <Skeleton isLoaded={ready} rounded="full">
            <Avatar
              src={ready ? avatarUrl(user) : undefined}
              size="md"
              className="highlight-block"
            />
          </Skeleton>
          <Stack spacing={0}>
            <Skeleton isLoaded={ready} fitContent>
              <Text fontSize="xs">Created by</Text>
            </Skeleton>
            <HStack spacing="2">
              <Skeleton isLoaded={ready}>
                <Link
                  fontWeight={700}
                  href={ready ? `/@${user.username}` : ""}
                  _hover={{ color: highlight }}
                  className="highlight-block"
                >
                  {user?.username || "Loading..."}
                </Link>
              </Skeleton>
              {ready && user.verified && (
                <Box color="blue.300">
                  <Tooltip label="Verified">
                    <IconDiscountCheck size={20} aria-label="Verified" />
                  </Tooltip>
                </Box>
              )}
            </HStack>
          </Stack>
        </HStack>
        <ActionArea />
      </Flex>
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};
