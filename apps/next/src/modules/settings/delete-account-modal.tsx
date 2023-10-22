import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components";
import { WEBSITE_URL } from "@quenti/lib/constants/url";
import { api } from "@quenti/trpc";

import {
  Button,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { data: session, update } = useSession()!;
  const [usernameValue, setUsernameValue] = React.useState("");

  const red = useColorModeValue("red.500", "red.200");

  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      await router.push(WEBSITE_URL);
      await update();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Delete account</Modal.Heading>
          <Stack spacing="4">
            <Text>
              Are you absolutely sure you want to delete your account? All of
              your sets, folders and other data will be completely deleted.{" "}
              <strong>This action is irreversible.</strong>
            </Text>
            <Text fontWeight={600} color={red}>
              {deleteAccount.error
                ? `Error: ${deleteAccount.error.message}`
                : "Enter your username to proceed."}
            </Text>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <Stack gap={2} direction={{ base: "column", md: "row" }} w="full">
            <Input
              className="highlight-block"
              placeholder="Username"
              rounded="md"
              px="4"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
            />
            <Button
              px="10"
              isDisabled={usernameValue !== session!.user?.username}
              isLoading={deleteAccount.isLoading}
              onClick={() => deleteAccount.mutate()}
              variant="outline"
              colorScheme="red"
            >
              Delete account
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
