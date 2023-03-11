import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../utils/api";

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const session = useSession()!.data!;
  const [usernameValue, setUsernameValue] = React.useState("");

  const red = useColorModeValue("red.500", "red.200");
  const inputBg = useColorModeValue("gray.200", "gray.750");

  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      await router.push("/");
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent px="4" py="6" rounded="xl">
        <ModalBody pb="8">
          <Stack spacing={6}>
            <Heading>Delete Account</Heading>
            <Text>
              Are you absolutely sure you want to delete your account? All of
              your sets, folders, and other data will be completely deleted.{" "}
              <b>This action is irreversible.</b>
            </Text>
            <Text fontWeight={700} color={red}>
              {deleteAccount.error
                ? `Error: ${deleteAccount.error.message}`
                : "Enter your username to proceed."}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack gap={2} direction={{ base: "column", md: "row" }} w="full">
            <Input
              className="highlight-mask"
              fontWeight={700}
              variant="flushed"
              placeholder="Username"
              bg={inputBg}
              rounded="md"
              px="4"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              _focus={{
                borderColor: "orange.300",
                boxShadow: `0px 1px 0px 0px #ffa54c`,
              }}
            />
            <Button
              px="10"
              isDisabled={usernameValue !== session.user?.username}
              isLoading={deleteAccount.isLoading}
              onClick={() => deleteAccount.mutate()}
            >
              Delete Account
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
