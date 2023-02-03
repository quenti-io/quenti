import { Avatar, Box, Heading, HStack, Tooltip } from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useProfile } from "../../hooks/use-profile";

export const ProfileArea = () => {
  const profile = useProfile();

  return (
    <HStack gap={4}>
      <Avatar src={profile.image!} />
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
    </HStack>
  );
};
