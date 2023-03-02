import {
  Avatar,
  Button,
  ButtonGroup,
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
  Tr
} from "@chakra-ui/react";
import type { RecentFailedLogin } from "@prisma/client";
import { IconPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import React from "react";
import { useAdmin } from "../../hooks/use-admin";
import { api } from "../../utils/api";
import { avatarUrl } from "../../utils/avatar";
import { dtFormatter } from "../../utils/time";
import { AllowedRegexes } from "./allowed-regexes";

export const AdminEmails = () => {
  const [email, setEmail] = React.useState("");

  const emails = api.admin.getWhitelist.useQuery();
  const whitelistEmail = api.admin.whitelistEmail.useMutation({
    onSuccess: async () => {
      setEmail("");
      await emails.refetch();
    },
  });

  const handleSubmit = async () => {
    await whitelistEmail.mutateAsync(email);
  };

  return (
    <Stack spacing={12}>
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
              {(emails.data?.whitelist || []).map(({ email, createdAt }) => (
                <Entry key={email} email={email} createdAt={createdAt} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
      <AllowedRegexes />
      <Stack spacing={6}>
        <Heading size="md">Recent Failed Logins</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Account</Th>
                <Th>Email</Th>
                <Th>Time</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {(emails.data?.attemtps || []).map((props) => (
                <FailedEntry key={props.id} {...props} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
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
      <Td textAlign="right">
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

const FailedEntry: React.FC<RecentFailedLogin> = ({
  id,
  email,
  image,
  name,
  createdAt,
}) => {
  const utils = api.useContext();
  const allowFailedLogin = api.admin.allowFailedLogin.useMutation({
    onSuccess: async () => {
      await utils.admin.getWhitelist.refetch();
    },
  });
  const removeFailedLogin = api.admin.removeFailedLogin.useMutation({
    onSuccess: async () => {
      await utils.admin.getWhitelist.refetch();
    },
  });

  return (
    <Tr key={id}>
      <Td>
        <HStack>
          <Avatar src={image || ""} size="sm" />
          <Text>{name}</Text>
        </HStack>
      </Td>
      <Td>{email}</Td>
      <Td>{dtFormatter.format(createdAt)}</Td>
      <Td textAlign="right">
        <ButtonGroup>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<IconPlus />}
            aria-label="remove"
            isLoading={
              allowFailedLogin.isLoading && allowFailedLogin.variables === email
            }
            onClick={() => allowFailedLogin.mutate(email)}
          />
          <IconButton
            size="sm"
            variant="ghost"
            icon={<IconTrash />}
            aria-label="remove"
            isLoading={
              removeFailedLogin.isLoading &&
              removeFailedLogin.variables === email
            }
            onClick={() => removeFailedLogin.mutate(email)}
          />
        </ButtonGroup>
      </Td>
    </Tr>
  );
};
