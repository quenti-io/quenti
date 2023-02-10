import {
  Button,
  ButtonGroup,
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
import { useRouter } from "next/router";
import React from "react";
import { QUIZLET_IMPORT_REGEXP } from "../constants/characters";
import { api } from "../utils/api";

export interface ImportFromQuizletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportFromQuizletModal: React.FC<ImportFromQuizletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");

  const invalid = !!url && !QUIZLET_IMPORT_REGEXP.test(url);

  const primaryBg = useColorModeValue("gray.200", "gray.800");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const errorText = useColorModeValue("red.500", "red.200");

  const fromUrl = api.import.fromUrl.useMutation({
    onSuccess: async () => {
      onClose();

      if (router.pathname === "/create") {
        router.reload();
      } else await router.push("/create");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  React.useEffect(() => {
    setError("");
    setUrl("");
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="4" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading fontSize="4xl" color={headingColor}>
              Import from Quizlet
            </Heading>
            <Input
              placeholder="https://quizlet.com/123456789"
              variant="flushed"
              fontWeight={700}
              isInvalid={invalid}
              bg={primaryBg}
              color={inputColor}
              rounded="md"
              px="4"
              size="lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              _focus={{
                borderColor: invalid ? "red.300" : "blue.300",
                boxShadow: `0px 1px 0px 0px ${invalid ? "#fc8181" : "#4b83ff"}`,
              }}
            />
            {error && (
              <Text color={errorText} fontWeight={600}>
                {error}
              </Text>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap={2}>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={fromUrl.isLoading}
              isDisabled={!url || invalid}
              onClick={async () => {
                await fromUrl.mutateAsync({
                  url,
                });
              }}
            >
              Import
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
