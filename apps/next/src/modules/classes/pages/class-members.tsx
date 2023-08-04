import {
  Avatar,
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconExternalLink, IconSearch } from "@tabler/icons-react";
import React from "react";
import { useClassMembers } from "../../../hooks/use-class-members";
import { plural } from "../../../utils/string";

export const ClassMembers = () => {
  const { data } = useClassMembers();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const menuBg = useColorModeValue("white", "gray.800");

  const th = {
    textTransform: "none" as const,
    fontFamily: "body",
    letterSpacing: "inherit",
    fontWeight: 600,
    borderColor,
  };

  const [search, setSearch] = React.useState("");

  return (
    <Stack spacing="6">
      <Skeleton rounded="md" fitContent isLoaded={!!data} w="full">
        <InputGroup bg={menuBg} shadow="sm" rounded="md">
          <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
            <IconSearch size={18} />
          </InputLeftElement>
          <Input
            placeholder={`Search ${plural(
              data?.members.length || 0,
              "student"
            )}...`}
            pl="44px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Skeleton>
      <Box
        borderX="1px solid"
        borderTop="1px solid"
        rounded="lg"
        borderColor={borderColor}
        overflow="hidden"
        shadow="md"
        bg={menuBg}
      >
        <Table overflow="hidden">
          <Thead>
            <Tr>
              <Th {...th}>Name</Th>
              <Th {...th}>Email</Th>
              <Th {...th}>Section</Th>
              <Th {...th}>Manage</Th>
            </Tr>
          </Thead>
          {(data?.members || []).map((m) => (
            <Tr
              key={m.id}
              py="14px"
              px="18px"
              transition="background 0.2s ease-in-out"
              _hover={{
                background: hoverColor,
              }}
              borderColor={borderColor}
            >
              <Td py="14px" px="18px" borderColor={borderColor}>
                <HStack spacing="6">
                  <Avatar
                    src={m.user.image || undefined}
                    size="sm"
                    shadow="lg"
                  />
                  <Stack spacing="0">
                    <Text fontWeight={700} fontSize="md">
                      {m.user.name}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      @{m.user.username}
                    </Text>
                  </Stack>
                </HStack>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={mutedColor} fontSize="sm">
                  {m.user.email}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={mutedColor} fontSize="sm">
                  Block A
                </Text>
              </Td>
              <Td borderColor={borderColor} pr="0">
                <ButtonGroup
                  size="sm"
                  colorScheme="gray"
                  variant="outline"
                  isAttached
                >
                  <IconButton
                    aria-label="Go to profile"
                    icon={<IconExternalLink size={16} />}
                  />
                  <IconButton
                    aria-label="Go to profile"
                    icon={<IconExternalLink size={16} />}
                  />
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Table>
      </Box>
    </Stack>
  );
};
