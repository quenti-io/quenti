import {
  Text,
  HStack,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUsers } from "@tabler/icons-react";

export const EmptyStudentsCard = () => {
  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack spacing="3">
      <HStack spacing="4">
        <IconUsers />
        <Heading size="lg">No students</Heading>
      </HStack>
      <Text fontSize="sm" color={muted}>
        Accounts with emails ending in your organization&apos;s domain will show
        up here.
      </Text>
    </Stack>
  );
};
