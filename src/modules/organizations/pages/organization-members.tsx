import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../utils/api";
import { avatarUrl } from "../../../utils/avatar";

export const OrganizationMembers = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data: session } = useSession();

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  const me = org
    ? org.members.find((m) => m.userId == session?.user?.id)?.user
    : undefined;

  const [search, setSearch] = React.useState("");

  const menuBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.750");

  return (
    <Stack spacing="6">
      <HStack>
        <InputGroup bg={menuBg} shadow="sm" rounded="md">
          <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
            <IconSearch size={18} />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            pl="44px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button leftIcon={<IconPlus size={18} />}>Add</Button>
      </HStack>
      <Stack>
        <Box px="4" py="3" border="2px" borderColor={borderColor} rounded="lg">
          <HStack spacing="4">
            <Skeleton isLoaded={!!me} fitContent rounded="full" h="32px">
              <Avatar
                size="sm"
                src={me ? avatarUrl({ ...me, image: me.image! }) : ""}
              />
            </Skeleton>
            <Stack spacing="0">
              <Skeleton isLoaded={!!me} fitContent>
                <HStack>
                  <Text fontWeight={700} fontFamily="Outfit">
                    {me?.name || "placeholder text"}
                  </Text>
                  <Tag size="sm" colorScheme="blue">
                    You
                  </Tag>
                </HStack>
              </Skeleton>
              <Skeleton isLoaded={!!me} fitContent>
                <Text fontSize="sm" color="gray.500">
                  Owner
                </Text>
              </Skeleton>
            </Stack>
          </HStack>
        </Box>
      </Stack>
    </Stack>
  );
};
