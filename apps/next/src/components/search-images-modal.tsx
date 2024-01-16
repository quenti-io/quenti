import Compressor from "compressorjs";
import React from "react";

import { Link } from "@quenti/components";
import { BgGradient } from "@quenti/components/bg-gradient";
import { env } from "@quenti/env/client";
import { useDebounce } from "@quenti/lib/hooks/use-debounce";
import { type RouterOutputs, api } from "@quenti/trpc";

import {
  Box,
  Center,
  Fade,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconAlertCircle, IconCloudUpload } from "@tabler/icons-react";

import { type Context, editorEventChannel } from "../events/editor";
import { useDropzone } from "../hooks/use-dropzone";
import { AnimatedCloudUpload } from "./animated-icons/upload";

interface SearchImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ResultsContextProps {
  data: RouterOutputs["images"]["search"];
  onClick: (index: number) => void;
}

const ResultsContext = React.createContext<ResultsContextProps>({
  data: undefined,
  onClick: () => undefined,
});

export const SearchImagesModal: React.FC<SearchImagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentContext, setCurrentContext] = React.useState<Context>();
  const currentContextRef = React.useRef(currentContext);
  currentContextRef.current = currentContext;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileRef = React.useRef(file);
  fileRef.current = file;

  const [progress, setProgress] = React.useState<number | null>(null);

  const reset = () => {
    setFile(null);
    setFileName(null);
    setProgress(null);
  };

  const start = (file: File) => {
    setUploadError(null);
    setFileName(file.name);

    new Compressor(file, {
      quality: 0.8,
      convertSize: 500_000,
      success: (result) => {
        setFile(result as File);
        if (result.size > 5_000_000) {
          setUploadError("That file is too large to upload (> 5 MB)");
          reset();
          return;
        }

        editorEventChannel.emit("requestUploadUrl", currentContextRef.current!);
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    onDropAccepted: (files) => {
      start(files[0]!);
    },
  });

  React.useEffect(() => {
    const upload = (jwt?: string) => {
      void (async () => {
        if (!jwt) return;

        const result = (await doUpload(jwt, fileRef.current!)) as boolean;
        if (!result) {
          setUploadError(
            "Something went wrong while uploading. Please try again.",
          );
          reset();
          return;
        }

        editorEventChannel.emit("uploadComplete", currentContextRef.current!);

        reset();
        onClose();
      })();
    };

    editorEventChannel.on("openSearchImages", setCurrentContext);
    editorEventChannel.on("startUpload", upload);
    return () => {
      editorEventChannel.off("openSearchImages", setCurrentContext);
      editorEventChannel.off("startUpload", upload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isFetching } = api.images.search.useQuery(
    {
      query: debouncedQuery,
    },
    {
      enabled: !!debouncedQuery.length,
    },
  );

  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (
        document.activeElement !== rootRef.current &&
        document.activeElement !== inputRef.current
      )
        return;

      const getFilesFromClipboardEvent = (event: ClipboardEvent) => {
        const dataTransferItems = event.clipboardData?.items;
        if (!dataTransferItems) return;

        const files = Array.from(dataTransferItems).reduce<File[]>(
          (acc, curr) => {
            const f = curr.getAsFile();
            return f ? [...acc, f] : acc;
          },
          [],
        );

        return files;
      };

      const pastedFiles = getFilesFromClipboardEvent(event);
      if (!pastedFiles?.length) return;

      start(pastedFiles[0]!);
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doUpload = async (jwt: string, blob: unknown) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", `${env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT}/terms`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = e.loaded / e.total;
          setProgress(progress);
        }
      });
      xhr.addEventListener("loadend", () => {
        resolve(xhr.readyState === 4 && xhr.status === 200);
      });

      xhr.send(blob as XMLHttpRequestBodyInit);
    });
  };

  const expanded = !!data || isFetching;

  const borderColor = useColorModeValue("gray.200", "gray.750");

  return (
    <ResultsContext.Provider
      value={{
        data,
        onClick: (index) => {
          const url = data?.response?.results[index]?.urls.small;
          if (!url) return;

          editorEventChannel.emit("imageSelected", {
            context: currentContext!,
            optimisticUrl: url,
            query: debouncedQuery,
            index,
          });

          onClose();
        },
      }}
    >
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay
          backdropFilter="blur(12px)"
          transform="translateZ(0px)"
          backgroundColor={useColorModeValue(
            "rgba(247, 250, 252, 75%)",
            "rgba(23, 25, 35, 40%)",
          )}
        />
        <ModalContent bg="transparent" shadow="none">
          <ModalBody
            p="0"
            background={useColorModeValue(
              "rgba(247, 250, 252, 40%)",
              "rgba(23, 25, 35, 60%)",
            )}
            backdropFilter="blur(12px)"
            borderWidth="2px"
            rounded="xl"
            borderColor={borderColor}
            shadow="xl"
            transition="transform 0.15s ease-in-out"
            _active={{
              transform: "scale(0.97)",
            }}
          >
            <Box py="4" px="5">
              <Input
                ref={inputRef}
                placeholder="Search for an image"
                size="sm"
                variant="unstyled"
                fontSize="xl"
                px="0"
                _placeholder={{
                  color: "gray.500",
                }}
                color={useColorModeValue("gray.900", "whiteAlpha.900")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Box>
            <Box
              overflow="hidden"
              h={expanded ? 235 : 0}
              className="transition-[height] duration-500"
            >
              <SimpleGrid
                columns={5}
                gap="2"
                p="2"
                borderTopWidth="2px"
                borderTopColor={borderColor}
                opacity={expanded ? 1 : 0}
                className="transition-opacity duration-500"
              >
                <GridItem colSpan={2}>
                  <Thumbnail index={0} />
                </GridItem>
                <DoubleRow />
                <DoubleRow offset={2} />
                <DoubleRow offset={4} />
              </SimpleGrid>
            </Box>
          </ModalBody>
          <Text mt="3" fontSize="xs" ml="3" color="gray.500" opacity={0.75}>
            Images by{" "}
            <Link
              href="https://unsplash.com/?utm_source=quenti&utm_medium=referral"
              fontWeight={600}
              transition="color 0.15s ease-in-out"
              color="gray.600"
              _hover={{
                color: "gray.700",
              }}
              _dark={{
                color: "gray.400",
                _hover: {
                  color: "gray.300",
                },
              }}
            >
              Unsplash
            </Link>
          </Text>
          <VStack mt="6" mx="6" position="relative">
            <Center
              w="full"
              px="6"
              py="10"
              position="relative"
              rounded="xl"
              overflow="hidden"
              borderWidth="2px"
              transition="border-color 0.2s ease-in-out"
              bg="rgba(247, 250, 252, 40%)"
              borderColor="gray.100"
              _hover={{
                borderColor: "gray.200",
              }}
              _dark={{
                bg: "rgba(23, 25, 35, 30%)",
                borderColor: "gray.750",
                _hover: {
                  borderColor: "gray.700",
                },
              }}
              {...getRootProps()}
              cursor="pointer"
              role="group"
              ref={rootRef}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                bg="gray.100"
                _dark={{
                  bg: "gray.750",
                }}
                h="full"
                w={progress ? `${progress * 100}%` : 0}
                className="transition-[width] duration-700"
                opacity={0.5}
              />
              <input {...getInputProps()} />
              {fileName ? (
                <Center h="46px" zIndex={10}>
                  <HStack spacing="3">
                    <Box
                      color="blue.600"
                      _dark={{
                        color: "blue.100",
                      }}
                      position="relative"
                    >
                      <Fade
                        in
                        transition={{
                          enter: {
                            duration: 1.5,
                          },
                        }}
                      >
                        <UploadDots />
                      </Fade>
                      <AnimatedCloudUpload size={32} />
                    </Box>
                    <Text fontSize="sm" fontWeight={600}>
                      {fileName}
                    </Text>
                  </HStack>
                </Center>
              ) : (
                <VStack spacing="1" zIndex={10}>
                  <HStack
                    color="gray.500"
                    spacing="3"
                    transition="color 0.2s ease-in-out"
                    _groupHover={{
                      color: "gray.800",
                      _dark: {
                        color: "gray.200",
                      },
                    }}
                  >
                    <IconCloudUpload />
                    <Text fontWeight={600}>Upload an image</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Drop or paste files here
                  </Text>
                </VStack>
              )}
            </Center>
            {uploadError && (
              <VStack
                position="absolute"
                top="100%"
                mt="3"
                left="50%"
                transform="translateX(-50%)"
                w="full"
              >
                <Fade in>
                  <HStack
                    color="red.500"
                    spacing="2"
                    _dark={{
                      color: "red.300",
                    }}
                  >
                    <Box minW={4}>
                      <IconAlertCircle size={16} />
                    </Box>
                    <Text fontSize="sm" fontWeight={500}>
                      {uploadError}
                    </Text>
                  </HStack>
                </Fade>
              </VStack>
            )}
          </VStack>
        </ModalContent>
      </Modal>
    </ResultsContext.Provider>
  );
};

const dot = keyframes({
  "0%": {
    transform: "translateY(42px)",
  },
  "100%": {
    transform: "translateY(-42px)",
  },
});

const UploadDots = () => {
  return (
    <HStack
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      opacity={0.2}
      spacing="0"
    >
      <UploadColumn opacity={0.3} transform="translateY(6px)" />
      <UploadColumn opacity={0.7} speed={0.75} />
      <UploadColumn opacity={0.3} transform="translateY(6px)" />
    </HStack>
  );
};

const UploadColumn: React.FC<{
  speed?: number;
  opacity: number;
  transform?: string;
}> = ({ opacity, speed = 1, transform }) => {
  return (
    <Stack spacing="0" opacity={opacity} transform={transform}>
      {Array.from({ length: 10 }).map((_, i) => (
        <Box key={i} p="2">
          <Box
            w="5px"
            h="5px"
            rounded="full"
            bg="currentcolor"
            animation={`${dot} ${speed}s infinite linear`}
          />
        </Box>
      ))}
    </Stack>
  );
};

const DoubleRow: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  return (
    <GridItem>
      <SimpleGrid h="full" gap="2">
        <GridItem>
          <Thumbnail index={1 + offset} />
        </GridItem>
        <GridItem>
          <Thumbnail index={2 + offset} />
        </GridItem>
      </SimpleGrid>
    </GridItem>
  );
};

const Thumbnail: React.FC<{ index: number }> = ({ index }) => {
  const { data, onClick } = React.useContext(ResultsContext);

  const image = data?.response?.results[index];

  return (
    <Skeleton
      rounded="lg"
      h="full"
      w="full"
      isLoaded={!!data}
      overflow="hidden"
      aspectRatio="1 / 1"
    >
      {image && (
        <Box
          position="relative"
          role="group"
          cursor="pointer"
          bg={image.color || "transparent"}
          onClick={(e) => {
            if (e.target instanceof HTMLAnchorElement) return;
            onClick(index);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.urls.small}
            alt={image.alt_description || "Image"}
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
            }}
          />
          <BgGradient
            position="absolute"
            bottom="0"
            left="0"
            w="full"
            px="7px"
            py="1"
            pt="10"
            hsl="230, 21%, 11%"
            transition="opacity 0.2s ease-in-out"
            opacity={0}
            _groupHover={{
              opacity: 1,
            }}
            overflow="hidden"
          >
            <Box w="full" overflow="hidden" textOverflow="ellipsis">
              <Text
                as={Link}
                href={`${image.user.links.html}?utm_source=quenti&utm_medium=referral`}
                overflow="hidden"
                target="_blank"
                fontSize="10px"
                color="gray.50"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                {image.user.first_name} {image.user.last_name}
              </Text>
            </Box>
          </BgGradient>
          <Box
            position="absolute"
            top="0"
            left="0"
            width="full"
            height="full"
            bg="white"
            transition="opacity 0.2s ease-in-out"
            opacity={0}
            pointerEvents="none"
            _groupHover={{
              opacity: 0.1,
            }}
          />
        </Box>
      )}
    </Skeleton>
  );
};
