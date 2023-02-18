import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IconPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import React from "react";
import { useAdmin } from "../../hooks/use-admin";
import { api } from "../../utils/api";
import { avatarUrl } from "../../utils/avatar";
import { dtFormatter } from "../../utils/time";

export const AdminEmails = () => {
  const [email, setEmail] = React.useState("");

  const whitelist = api.admin.getWhitelist.useQuery();
  const whitelistEmail = api.admin.whitelistEmail.useMutation({
    onSuccess: async () => {
      setEmail("");
      await whitelist.refetch();
    },
  });

  const handleSubmit = async () => {
    await whitelistEmail.mutateAsync(email);
  };

  return (
    <Stack spacing={6}>
      <Heading size="lg">Whitelisted Emails</Heading>
      <InputGroup size="lg">
        <Input
          placeholder="email@example.com"
          isInvalid={whitelistEmail.isError}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={async (e) => {
            if (whitelistEmail.isLoading) return;
            if (e.key === "Enter") await handleSubmit();
          }}
        />
        <InputRightElement w="30">
          <Button
            size="lg"
            isLoading={whitelistEmail.isLoading}
            leftIcon={<IconPlus />}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Added</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {(whitelist.data || []).map(({ email, createdAt }) => (
              <Entry key={email} email={email} createdAt={createdAt} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

interface EntryProps {
  email: string;
  createdAt: Date;
}

const Entry: React.FC<EntryProps> = ({ email, createdAt }) => {
  const utils = api.useContext();
  const { users } = useAdmin();
  const user = users.find((u) => u.email === email);

  const removeEmail = api.admin.removeEmail.useMutation({
    onSuccess: async () => {
      await utils.admin.getWhitelist.refetch();
    },
  });

  return (
    <Tr key={email}>
      <Td>
        {user ? (
          <HStack>
            <Avatar src={avatarUrl(user)} size="sm" />
            <Text>{user.username}</Text>
          </HStack>
        ) : (
          <HStack color="gray.500">
            <Center w="8">
              <IconUserPlus size={18} />
            </Center>
            <Text>Unverified</Text>
          </HStack>
        )}
      </Td>
      <Td>{email}</Td>
      <Td>{dtFormatter.format(createdAt)}</Td>
      <Td>
        <IconButton
          size="sm"
          variant="ghost"
          icon={<IconTrash />}
          aria-label="remove"
          isLoading={removeEmail.isLoading && removeEmail.variables === email}
          onClick={() => removeEmail.mutate(email)}
        />
      </Td>
    </Tr>
  );
};
