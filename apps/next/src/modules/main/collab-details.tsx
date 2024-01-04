import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import { IconExternalLink, IconUsersGroup } from "@tabler/icons-react";

import { useSet } from "../../hooks/use-set";
import { ActionArea } from "./action-area";

interface CollaboratorIcon {
  type: "creator" | "collaborator";
  user: {
    id: string;
    image: string;
    name?: string | null;
    username: string;
  };
}

export const CollabDetails = () => {
  const { collaborators, user, description, assignment, id } = useSet();

  const [collaboratorIcons, setCollaboratorIcons] = React.useState<
    CollaboratorIcon[]
  >([]);

  const { data } = api.classes.getStudents.useQuery({
    classId: "clq11d6zz003drzxhsbj776zw",
  });

  React.useEffect(() => {
    if (!data || !user) return;

    const c = new Array<CollaboratorIcon>();

    c.push({
      type: "creator",
      user: {
        ...user,
        username: user.username!,
      },
    });

    c.push(
      ...data.students.map(
        (s) =>
          ({
            type: "collaborator",
            user: {
              ...s.user,
              username: s.user.username!,
            },
          }) as CollaboratorIcon,
      ),
    );

    setCollaboratorIcons(c);
  }, [data, user]);

  return (
    <Stack spacing={8}>
      <Flex
        justifyContent={{ base: "start", sm: "space-between" }}
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 8, md: 4 }}
      >
        <Box minW="189px" maxW={{ base: "250px", md: "189px" }} w="full">
          <Stack spacing="3">
            <HStack>
              <IconUsersGroup />
              <Heading fontSize="2xl">Collab</Heading>
              <Tag
                size="sm"
                colorScheme="red"
                _light={{
                  bg: "rgba(254, 215, 215, 0.4)",
                }}
              >
                Beta
              </Tag>
            </HStack>
            <Text color="gray.500" fontSize="sm" fontWeight={500}>
              Contribute terms to this set with your classmates.
            </Text>
            {assignment && (
              <ButtonGroup mt="2" spacing="3">
                <Button w="full" size="sm" as={Link} href={`/${id}/collab`}>
                  Start assignment
                </Button>
                <IconButton
                  colorScheme="gray"
                  aria-label="View assignment"
                  icon={<IconExternalLink size={16} />}
                  size="sm"
                  variant="outline"
                  as={Link}
                  href={`/a/${assignment.classId}/${assignment.id}`}
                />
              </ButtonGroup>
            )}
          </Stack>
        </Box>
        <Box w="full">
          <Flex
            maxH="128px"
            overflow="hidden"
            justifyContent={{ base: "start", md: "center" }}
            ml={{ base: "-3", md: "0" }}
            flexWrap="wrap"
          >
            {collaboratorIcons.map((c) => (
              <Box key={c.user.id} display="inline-flex" p="3">
                <Popover isLazy trigger="hover" placement="top">
                  <PopoverTrigger>
                    <Stack spacing="0">
                      <Avatar
                        src={c.user.image}
                        size="sm"
                        className="highlight-block"
                      />
                      <Box w="full" h="2" position="relative">
                        <Box
                          position="absolute"
                          top="-1"
                          marginLeft="50%"
                          transform="translateX(-50%)"
                          outline="3px solid"
                          outlineColor="gray.50"
                          _dark={{
                            outlineColor: "gray.900",
                          }}
                          rounded="full"
                          w="8px"
                          h="8px"
                          bg={c.type == "creator" ? "green.400" : "blue.300"}
                        />
                      </Box>
                    </Stack>
                  </PopoverTrigger>
                  <CollaboratorPopoverContent {...c} />
                </Popover>
              </Box>
            ))}
          </Flex>
        </Box>
        <ActionArea />
      </Flex>
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};

const CollaboratorPopoverContent = ({ user, type }: CollaboratorIcon) => {
  return (
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
    >
      <Stack spacing="3">
        <HStack spacing="3">
          <Avatar src={user.image} size="sm" />
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
  );
};
