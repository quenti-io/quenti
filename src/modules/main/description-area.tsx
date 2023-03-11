import {
  Avatar,
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { Link } from "../../components/link";
import { useSet } from "../../hooks/use-set";
import { avatarUrl } from "../../utils/avatar";
import { ActionArea } from "./action-area";

export const DescriptionArea = () => {
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
          <Avatar src={avatarUrl(user)} size="md" className="highlight-mask" />
          <Stack spacing={0}>
            <Text fontSize="xs">Created by</Text>
            <HStack spacing="2">
              <Link
                fontWeight={700}
                href={`/@${user.username}`}
                _hover={{ color: highlight }}
                className="highlight-mask"
              >
                {user.username}
              </Link>
              {user.verified && (
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
