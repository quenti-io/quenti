import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Fade,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  ScaleFade,
  SlideFade,
  Spinner,
  Stack,
  Text,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";

import { QUIZLET_IMPORT_REGEXP } from "../../../../packages/lib/constants/characters";
import { effectChannel } from "../events/effects";
import { queryEventChannel } from "../events/query";
import { useTelemetry } from "../lib/telemetry";
import styles from "./glow-wrapper.module.css";

export interface ImportFromQuizletModalProps {
  isOpen: boolean;
  onClose: () => void;
  edit?: boolean;
}

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "80%": {
    color: "#ffbf7d",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const messages = [
  "Generating witty dialog...",
  "Spinning the hamster...",
  "Searching for plot device...",
  "Updating the Updater...",
  "Simulating traveling salesman...",
  "Downloading the Downloader...",
  "Shovelling coal into the server...",
  "Cracking military-grade encryption...",
  "Bypassing security protocols...",
  "Scanning for signs of sentience...",
  "Searching for hidden Easter eggs...",
  "Spinning the wheel of fortune...",
  "Cleaning off Quizlet's cobwebs...",
  "Feel free to spin in your chair...",
  "Twiddling thumbs...",
  "Waiting for the system admin to hit enter...",
  "Consulting the manual...",
  "Grabbing extra minions...",
  "Optimizing the Optimizer...",
  "Reheating coffee...",
  "How about this weather, eh?",
  "Walking the dog...",
  "Granting wishes...",
  "Laughing at your pictures-I mean, loading...",
];

export const ImportFromQuizletModal: React.FC<ImportFromQuizletModalProps> = ({
  isOpen,
  onClose,
  edit = false,
}) => {
  const { event } = useTelemetry();
  const router = useRouter();

  const [_url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [importStarted, setImportStarted] = React.useState<number | null>(null);

  const attemptFormat = (u: string) => {
    // Remove the scheme if it exists
    const parsed = u.replace(/^(https?:\/\/)?/, "");

    const segments = parsed.split("/");
    // Find the segment that is most probably the ID
    const id = segments.find((segment) => /^\d+$/.test(segment));
    if (id) {
      return `https://quizlet.com/${id}`;
    }
    return u;
  };

  const url = attemptFormat(_url);
  const urlIsShare = url
    .replace("http://", "")
    .replace("https://", "")
    .startsWith("quizlet.com/_");
  const invalid = !!url && !QUIZLET_IMPORT_REGEXP.test(url);

  const errorText = useColorModeValue("red.500", "red.200");
  const spinnerBg = useColorModeValue("gray.200", "gray.600");

  const fromUrl = api.import.fromUrl.useMutation({
    onSuccess: async (data) => {
      if (data) {
        const finished = Date.now();
        const elapsed = importStarted ? finished - importStarted : 0;

        void event("import_completed", {
          setId: data.createdSetId,
          title: data.title,
          terms: data.terms,
          origin: url,
          source: "quizlet",
          elapsed,
        });

        await router.push(
          !edit ? `/${data.createdSetId}` : `/${data.createdSetId}/edit`,
        );

        onClose();
        requestAnimationFrame(() => {
          setUrl("");
        });

        if (!edit) {
          effectChannel.emit("prepareConfetti");

          const handler = () => {
            effectChannel.emit("confetti");
            queryEventChannel.off("setQueryRefetched", handler);
          };
          queryEventChannel.on("setQueryRefetched", handler);
        }
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const isLoading = fromUrl.isLoading;

  const defaultMessage = "Hang on while we fetch your set...";
  const [message, setMessage] = React.useState(defaultMessage);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage((message) => {
        let newMessage = message;
        while (newMessage == message) {
          newMessage =
            messages[Math.floor(Math.random() * (messages.length - 1))]!;
        }
        return newMessage;
      });
    }, 5000);

    if (!isLoading) {
      clearInterval(interval);
      setMessage(defaultMessage);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered={false}>
      <Modal.Overlay />
      <Modal.Content
        className={styles.card}
        _before={{
          opacity: isLoading ? 1 : 0,
        }}
        _after={{
          opacity: isLoading ? 1 : 0,
        }}
      >
        <Stack
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          rounded="xl"
        >
          <Modal.Body>
            <Modal.Heading>Import from Quizlet</Modal.Heading>
            <FormControl isInvalid={!!error}>
              <Input
                placeholder="https://quizlet.com/123456789"
                variant="flushed"
                isInvalid={invalid}
                rounded="lg"
                fontWeight={700}
                bg="gray.100"
                px="14px"
                _dark={{
                  bg: "gray.700",
                }}
                value={_url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {urlIsShare && (
                <Text mt="4" fontSize="sm">
                  Copy the link from the address bar in your browser.
                  <br />
                  <strong>
                    Using the link copied from the share menu will not work.
                  </strong>
                </Text>
              )}
              <FormErrorMessage color={errorText} fontWeight={600} mt="4">
                {error}
              </FormErrorMessage>
            </FormControl>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <HStack justifyContent="space-between" w="full">
              <HStack spacing="3">
                <ScaleFade
                  in={isLoading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner
                    size="sm"
                    color="blue.300"
                    animation={`${spin} 1.25s cubic-bezier(.54,-0.18,.39,.97) infinite`}
                    style={{
                      animationDelay: "0.8s",
                    }}
                    emptyColor={spinnerBg}
                  />
                </ScaleFade>
                <SlideFade in={isLoading}>
                  <Text fontSize="sm" fontWeight={600}>
                    {message}
                  </Text>
                </SlideFade>
              </HStack>
              <Fade in={!isLoading}>
                <ButtonGroup gap={2} isDisabled={isLoading}>
                  <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    isLoading={fromUrl.isLoading}
                    isDisabled={!url || invalid}
                    onClick={async () => {
                      setError("");
                      setImportStarted(Date.now());
                      await fromUrl.mutateAsync({
                        url,
                      });
                    }}
                  >
                    Import
                  </Button>
                </ButtonGroup>
              </Fade>
            </HStack>
          </Modal.Footer>
        </Stack>
      </Modal.Content>
    </Modal>
  );
};

export default ImportFromQuizletModal;
