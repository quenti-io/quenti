import { HStack, Heading, Stack, Text } from "@chakra-ui/react";

import { IconUsers } from "@tabler/icons-react";

export const EmptyStudentsCard = () => {
  return (
    <Stack>
      <HStack spacing="4">
        <IconUsers size={32} />
        <Heading>No students</Heading>
      </HStack>
      <Text color="gray.500">
        Accounts with emails ending in your organization&apos;s domain will show
        up here
      </Text>
    </Stack>
  );
};
