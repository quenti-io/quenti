import { useRouter } from "next/router";

import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconDiscountCheck } from "@tabler/icons-react";

import { useProfile } from "../../hooks/use-profile";

export const ProfileArea = () => {
  const profile = useProfile();
  const grayText = useColorModeValue("gray.700", "gray.300");

  return (
    <HStack spacing="6">
      <Avatar src={avatarUrl(profile)} size="lg" className="highlight-block" />
      <Flex
        flexDir="column"
        justifyContent={profile.name ? "space-between" : "center"}
        h="16"
      >
        <HStack spacing="2">
          <Heading className="highlight-block" w="max-content">
            {profile.name ?? profile.username}
          </Heading>
          {profile.verified && (
            <Box color="blue.300">
              <Tooltip label="Verified">
                <IconDiscountCheck aria-label="Verified" />
              </Tooltip>
            </Box>
          )}
        </HStack>
        {profile.name && (
          <Text
            lineHeight="none"
            fontSize="sm"
            color={grayText}
            className="highlight-block"
            w="max-content"
          >
            @{profile.username}
          </Text>
        )}
      </Flex>
    </HStack>
  );
};

ProfileArea.Skeleton = function ProfileAreaSkeleton() {
  const router = useRouter();
  const username = router.query.username as string | undefined;

  return (
    <HStack spacing="6">
      <Skeleton fitContent h="max-content" rounded="full">
        <Avatar size="lg" />
      </Skeleton>
      <Flex flexDir="column" justifyContent="space-between" h="16">
        <Skeleton fitContent rounded="md">
          <Heading w="max-content">Placholder Name</Heading>
        </Skeleton>
        <Flex alignItems="center" h="14px">
          <SkeletonText
            noOfLines={1}
            skeletonHeight="12px"
            rounded="4px"
            overflow="hidden"
          >
            <Text lineHeight="none" fontSize="sm" w="max-content">
              {username ? username.replace("@", "") : "username"}
            </Text>
          </SkeletonText>
        </Flex>
      </Flex>
    </HStack>
  );
};
