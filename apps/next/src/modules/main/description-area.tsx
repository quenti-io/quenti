import {
  Avatar,
  Box,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
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
          <Avatar src={avatarUrl(user)} size="md" className="highlight-block" />
          <Stack spacing={0}>
            <Text fontSize="xs">Created by</Text>
            <HStack spacing="2">
              <Link
                fontWeight={700}
                href={`/@${user.username}`}
                _hover={{ color: highlight }}
                className="highlight-block"
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

DescriptionArea.Skeleton = function DescriptionAreaSkeleton() {
  return (
    <Stack spacing={8}>
      <Flex
        justifyContent={{ base: "start", sm: "space-between" }}
        flexDir={{ base: "column", sm: "row" }}
        gap={{ base: 8, sm: 0 }}
      >
        <HStack spacing={4}>
          <Skeleton w="12" h="12" rounded="full" />
          <Stack spacing={0}>
            <Flex alignItems="center" h="18px">
              <SkeletonText fitContent skeletonHeight="3" noOfLines={1}>
                <Text fontSize="xs">Created by</Text>
              </SkeletonText>
            </Flex>
            <Flex alignItems="center" h="6">
              <SkeletonText fitContent skeletonHeight="4" noOfLines={1}>
                <Text fontWeight={700}>placeholder</Text>
              </SkeletonText>
            </Flex>
          </Stack>
        </HStack>
        <ActionArea.Skeleton />
      </Flex>
    </Stack>
  );
};
