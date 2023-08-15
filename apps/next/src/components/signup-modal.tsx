import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IconBrandGoogle } from "@tabler/icons-react";

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
      size="3xl"
      initialFocusRef={focusRef}
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="2xl">
        <ModalBody paddingX="16" paddingY="8">
          <ModalCloseButton />
          <VStack spacing="8">
            <VStack spacing="4">
              <Heading>Sign up to continue studying</Heading>
              <Text fontSize="lg">{message}</Text>
            </VStack>
            <Button
              size="lg"
              ref={focusRef}
              leftIcon={<IconBrandGoogle size={18} stroke="4px" />}
              onClick={async () =>
                await signIn("google", {
                  callbackUrl: callbackUrl || router.asPath,
                })
              }
            >
              Continue with Google
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
