import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useProfile } from "../../hooks/use-profile";
import { avatarUrl } from "../../utils/avatar";

export const ProfileArea = () => {
  const profile = useProfile();
  const grayText = useColorModeValue("gray.700", "gray.300");

  return (
    <HStack gap={4}>
      <Avatar src={avatarUrl(profile)} size="lg" />
      <Flex
        flexDir="column"
        justifyContent={profile.name ? "space-between" : "center"}
        h="16"
      >
        <HStack gap={0}>
          <Heading>{profile.username}</Heading>
          {profile.verified && (
            <Box color="blue.300">
              <Tooltip label="Verified">
                <IconDiscountCheck aria-label="Verified" />
              </Tooltip>
            </Box>
          )}
        </HStack>
        {profile.name && (
          <Text lineHeight="none" fontSize="sm" color={grayText}>
            {profile.name}
          </Text>
        )}
      </Flex>
    </HStack>
  );
};
