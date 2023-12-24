import type { AssignmentType } from "@quenti/prisma/client";

import { Box, HStack, Heading, Stack, Text } from "@chakra-ui/react";

import { IconUsersGroup } from "@tabler/icons-react";

export interface AssignmentCardProps {
  for: "Teacher" | "Student";
  id: string;
  type: AssignmentType;
  name: string;
  createdAt: Date;
  availableAt: Date;
  dueAt?: Date;
  published?: boolean;
  submissions?: number;
  section?: {
    id: string;
    name: string;
    students: number;
  };
  submission?: {
    id: string;
    startedAt: Date;
    submittedAt?: Date;
  };
}

export const AssignmentCard = () => {
  return (
    <Box
      px="5"
      py="4"
      bg="white"
      borderColor="gray.100"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
      _dark={{
        borderColor: "gray.700",
        bg: "gray.800",
        _hover: {
          borderBottomColor: "blue.300",
        },
      }}
      rounded="lg"
      borderWidth="2px"
      shadow="md"
      sx={{
        "&:has(:focus-visible)": {
          borderColor: "blue.300",
          transform: "translateY(-2px)",
          _dark: {
            borderColor: "blue.300",
          },
        },
      }}
      transition="all ease-in-out 150ms"
    >
      <HStack spacing="4">
        <Box
          p="10px"
          color="blue.600"
          position="relative"
          overflow="hidden"
          rounded="full"
          outline="1.5px solid"
          outlineOffset={-1.5}
          outlineColor="gray.100"
          _dark={{
            color: "blue.300",
            outlineColor: "gray.750",
          }}
          shadow="md"
        >
          <Box
            p="10px"
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            rounded="full"
            bg="rgba(75, 131, 255, 0.1)"
            filter="blur(4px)"
            color="blue.200"
          >
            <Box opacity={0.75}>
              <IconUsersGroup size={24} />
            </Box>
          </Box>
          <IconUsersGroup size={24} />
        </Box>
        <Stack spacing="2px">
          <Heading fontSize="lg">Final Midterm Study Guide</Heading>
          <Text
            fontSize="sm"
            color="gray.600"
            _dark={{
              color: "gray.400",
            }}
          >
            Today at 2:00 PM
          </Text>
        </Stack>
      </HStack>
    </Box>
  );
};
