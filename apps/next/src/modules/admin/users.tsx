import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUser } from "@tabler/icons-react";
import React from "react";
import { Link } from "@quenti/components";
import { useAdmin } from "../../hooks/use-admin";
import { avatarUrl } from "@quenti/lib/avatar";
import { UserModal } from "./user-modal";

export const AdminUsers = () => {
  const { users } = useAdmin();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [targetId, setTargetId] = React.useState<string | undefined>();

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.750");

  return (
    <>
      <UserModal
        userId={targetId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Stack spacing={6}>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {users
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((user) => (
              <GridItem
                key={user.id}
                bg={bg}
                borderColor={border}
                borderWidth="2px"
                p="4"
                px="6"
                rounded="md"
                shadow="lg"
              >
                <Stack spacing={6}>
                  <Flex gap={4} w="full">
                    <Avatar src={avatarUrl(user)} size="sm" mt="2" />
                    <Stack w="full">
                      <Stack spacing={0}>
                        <Link
                          fontWeight={700}
                          fontSize="lg"
                          href={`/@${user.username}`}
                        >
                          {user.username}
                        </Link>
                        <Text fontSize="sm">{user.name}</Text>
                      </Stack>
                    </Stack>
                  </Flex>
                  <Button
                    leftIcon={<IconUser size={18} />}
                    w="full"
                    variant="outline"
                    onClick={() => {
                      setTargetId(user.id);
                      setModalOpen(true);
                    }}
                  >
                    Manage User
                  </Button>
                </Stack>
              </GridItem>
            ))}
        </Grid>
      </Stack>
    </>
  );
};
