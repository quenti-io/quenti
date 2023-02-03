import {
  Avatar,
  Box,
  HStack,
  Link,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const DescriptionArea = () => {
  const { description, user } = useSet();
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack spacing={8}>
      <HStack spacing={4}>
        <Avatar src={user.image} size="md" />
        <Stack spacing={0}>
          <Text fontSize="xs">Created by</Text>
          <HStack spacing="2">
            <Link
              fontWeight={700}
              href={`/@${user.username}`}
              _hover={{ color: highlight }}
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
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};
