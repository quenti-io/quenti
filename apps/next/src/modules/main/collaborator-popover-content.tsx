import { Link } from "@quenti/components";

import {
  Avatar,
  Box,
  Button,
  HStack,
  PopoverContent,
  Portal,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import { IconExternalLink } from "@tabler/icons-react";

import type { CollaboratorIcon } from "./collab-details";

export const CollaboratorPopoverContent = ({
  user,
  type,
}: CollaboratorIcon) => {
  return (
    <Portal>
      <Box zIndex={200} position="fixed">
        <PopoverContent
          p="3"
          w="max"
          bg="white"
          _dark={{
            bg: "gray.750",
          }}
          mb="1"
          rounded="xl"
          shadow="lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Stack spacing="3">
            <HStack spacing="3">
              <Avatar src={user.image || ""} size="sm" />
              <Stack spacing="0">
                <Text fontWeight={700} fontSize="sm">
                  {user.name ?? user.username}
                </Text>
                {user.name && (
                  <Text fontSize="xs" color="gray.500" fontWeight={600}>
                    {user.username}
                  </Text>
                )}
              </Stack>
            </HStack>
            <Box
              w="full"
              h="1.5px"
              rounded="full"
              bg="gray.100"
              _dark={{
                bg: "gray.700",
              }}
            />
            <HStack spacing="3">
              <Tag
                size="sm"
                colorScheme={type == "creator" ? "green" : "blue"}
                rounded="full"
                _light={{
                  bg: type == "creator" ? undefined : "blue.50",
                }}
              >
                {
                  {
                    creator: "Creator",
                    collaborator: "Collaborator",
                  }[type]
                }
              </Tag>
              <Button
                as={Link}
                href={`/@${user.username}`}
                size="xs"
                variant="link"
                rightIcon={<IconExternalLink size={14} />}
                colorScheme="gray"
              >
                View profile
              </Button>
            </HStack>
          </Stack>
        </PopoverContent>
      </Box>
    </Portal>
  );
};
