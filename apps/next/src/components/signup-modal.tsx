import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";

import {
  Button,
  ModalCloseButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { menuEventChannel } from "../events/menu";

export default function SignupModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [callbackUrl, setCallbackUrl] = React.useState<string | undefined>();
  const focusRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handler = (args: { message?: string; callbackUrl?: string }) => {
      setMessage(args.message || "Create a free account to continue studying");
      setCallbackUrl(args.callbackUrl);
      setIsOpen(true);
    };

    menuEventChannel.on("openSignup", handler);
    return () => {
      menuEventChannel.off("openSignup", handler);
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      isCentered={false}
      initialFocusRef={focusRef}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body pb="4">
          <ModalCloseButton rounded="full" top="3" right="3" />
          <VStack spacing="8">
            <VStack>
              <Modal.Heading>Sign up to continue studying</Modal.Heading>
              <Text>{message}</Text>
            </VStack>
            <Stack>
              <Button
                ref={focusRef}
                h="10"
                fontSize="sm"
                onClick={async () =>
                  await router.push(
                    `/auth/signup?callbackUrl=${encodeURIComponent(
                      callbackUrl || router.asPath,
                    )}`,
                  )
                }
              >
                Sign up for Quenti
              </Button>
              <Button
                h="10"
                variant="outline"
                fontSize="sm"
                onClick={async () =>
                  await router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(
                      callbackUrl || router.asPath,
                    )}`,
                  )
                }
              >
                I already have an account
              </Button>
            </Stack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
