import { Avatar, Box, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const DescriptionArea = () => {
  const { description, user } = useSet();

  return (
    <Stack spacing={8}>
      <HStack spacing={4}>
        <Avatar src={user.image} size="md" />
        <Stack spacing={0}>
          <Text fontSize="xs">Created by</Text>
          <HStack spacing="2">
            <Text fontWeight={700}>{user.name}</Text>
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
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};
