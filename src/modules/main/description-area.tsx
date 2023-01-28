import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import { useSet } from "../../hooks/use-set";

export const DescriptionArea = () => {
  const { description, user } = useSet();

  return (
    <Stack spacing={8}>
      <HStack spacing={4}>
        <Avatar src={user.image} size="md" />
        <Stack spacing={0}>
          <Text fontSize="xs">Created by</Text>
          <Text fontWeight={700}>{user.name}</Text>
        </Stack>
      </HStack>
      <Text>{description}</Text>
    </Stack>
  );
};
