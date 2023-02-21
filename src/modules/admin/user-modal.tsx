import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
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
  IconCode,
  IconCopy,
  IconDiscountCheck,
  IconGavel,
} from "@tabler/icons-react";
import { useAdmin } from "../../hooks/use-admin";
import { api } from "../../utils/api";
import { avatarUrl } from "../../utils/avatar";
import { dtFormatter } from "../../utils/time";

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
      await utils.admin.invalidate();
    },
  });
  const ban = api.admin.banUser.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
    },
  });

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
                    <HStack spacing={4}>
                      <IconCode size={18} />
                      <Text fontSize="sm" fontFamily="monospace">
                        {user.id}
                      </Text>
                      <IconButton
                        aria-label="Copy ID"
                        icon={<IconCopy />}
                        size="xs"
                        variant="ghost"
                      />
                    </HStack>
                    <HStack spacing={4}>
                      <IconCalendar size={18} />
                      <Text fontSize="sm">
                        {dtFormatter.format(user.createdAt)}
                      </Text>
                    </HStack>
                    {user.bannedAt && (
                      <HStack spacing={4}>
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
            <Box p="6">
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
            </Box>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
