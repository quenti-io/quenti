import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useAdmin } from "../../hooks/use-admin";
import { api } from "../../utils/api";
import { avatarUrl } from "../../utils/avatar";

export const AdminUsers = () => {
  const utils = api.useContext();
  const { users } = useAdmin();

  const verify = api.admin.verifyUser.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
    },
  });

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.750");

  return (
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
                  leftIcon={<IconDiscountCheck />}
                  w="full"
                  variant={user.verified ? "solid" : "outline"}
                  isLoading={
                    verify.variables?.userId === user.id && verify.isLoading
                  }
                  onClick={() =>
                    verify.mutate({
                      userId: user.id,
                      verified: !user.verified,
                    })
                  }
                >
                  {user.verified ? "Verified" : "Verify"}
                </Button>
              </Stack>
            </GridItem>
          ))}
      </Grid>
    </Stack>
  );
};
