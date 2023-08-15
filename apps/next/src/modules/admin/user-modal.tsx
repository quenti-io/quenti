import React from "react";

import { avatarUrl } from "@quenti/lib/avatar";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCalendar,
  IconCheck,
  IconCode,
  IconCopy,
  IconDiscountCheck,
  IconGavel,
} from "@tabler/icons-react";

import { useAdmin } from "../../hooks/use-admin";
import { dtFormatter } from "../../utils/time";
import { UserEnabledFlags } from "./user-enabled-flags";

interface UserModalProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const utils = api.useContext();
  const { users } = useAdmin();
  const user = users.find((u) => u.id === userId);

  const verify = api.admin.verifyUser.useMutation({
    onSuccess: async () => {
      await utils.admin.getUsers.invalidate();
    },
  });
  const ban = api.admin.banUser.useMutation({
    onSuccess: async () => {
      await utils.admin.getUsers.invalidate();
    },
  });

  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    void (async () => {
      await navigator.clipboard.writeText(user?.id ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    })();
  };

  const topBg = useColorModeValue("gray.200", "gray.750");
  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent rounded="xl" overflow="hidden" p="0">
        {user && (
          <ModalBody p="0">
            <Box w="full" p="8" bg={topBg}>
              <Flex gap={6}>
                <Avatar size="lg" src={avatarUrl(user)} />
                <Stack w="full" spacing={6}>
                  <Flex flexDir="column" justifyContent="space-between" h="16">
                    <Heading size="lg">{user.username}</Heading>
                    <Text>
                      {user.name} | {user.email}
                    </Text>
                  </Flex>
                  <Stack color={muted}>
                    <HStack spacing={3}>
                      <IconCode size={18} />
                      <Text fontSize="sm" fontFamily="monospace">
                        {user.id}
                      </Text>
                      <IconButton
                        aria-label="Copy ID"
                        icon={copied ? <IconCheck /> : <IconCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={copy}
                      />
                    </HStack>
                    <HStack spacing={3}>
                      <IconCalendar size={18} />
                      <Text fontSize="sm">
                        {dtFormatter.format(user.createdAt)}
                      </Text>
                    </HStack>
                    {user.bannedAt && (
                      <HStack spacing={3}>
                        <IconGavel size={18} />
                        <Text fontSize="sm">
                          {dtFormatter.format(user.bannedAt)}
                        </Text>
                      </HStack>
                    )}
                  </Stack>
                </Stack>
              </Flex>
            </Box>
            <Stack p="6" spacing={6}>
              <UserEnabledFlags user={user} />
              <Divider />
              <ButtonGroup w="full" spacing={4}>
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
                <Button
                  leftIcon={<IconGavel />}
                  w="full"
                  colorScheme="red"
                  variant={user.bannedAt ? "solid" : "outline"}
                  isLoading={ban.variables?.userId === user.id && ban.isLoading}
                  onClick={() =>
                    ban.mutate({
                      userId: user.id,
                      banned: !user.bannedAt,
                    })
                  }
                >
                  {user.bannedAt ? "Unban" : "Ban"}
                </Button>
              </ButtonGroup>
            </Stack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
