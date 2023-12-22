import React from "react";

import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconCopy, IconNewSection } from "@tabler/icons-react";

import { GhostGroup } from "../../../components/ghost-group";
import { TooltipWithTouch } from "../../../components/tooltip-with-touch";
import { useClass } from "../../../hooks/use-class";
import { useImageQrCode } from "../../../hooks/use-image-qrcode";
import { AddSectionModal } from "../add-section-modal";
import { SectionSelect } from "../section-select";

export const InviteBanner = () => {
  const { data: class_ } = useClass();
  const utils = api.useUtils();

  const initialSection = class_?.sections?.[0];
  const initialIdRef = React.useRef(initialSection?.id);
  initialIdRef.current = initialSection?.id;

  const [addSectionOpen, setAddSectionOpen] = React.useState(false);
  const [selectedSection, setSection] = React.useState<string>(
    initialSection?.id || "",
  );
  const [code, setCode] = React.useState<string | null>(
    initialSection?.joinCode?.code ?? null,
  );
  const [copied, setCopied] = React.useState(false);
  const { QR } = useImageQrCode();

  React.useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  React.useEffect(() => {
    const section = class_!.sections!.find((s) => s.id === selectedSection);
    if (!section) return;

    const code = section.joinCode?.code;
    setCode(code ?? null);
    if (!code) {
      createJoinCode.mutate({ classId: class_!.id, sectionId: section.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const createJoinCode = api.classes.createJoinCode.useMutation({
    onSuccess: async (data) => {
      await utils.classes.get.invalidate();
      setCode(data.code);
    },
  });

  React.useEffect(() => {
    if (!initialSection) return;
    setSection(initialSection.id);
  }, [initialSection]);

  return (
    <>
      <AddSectionModal
        isOpen={addSectionOpen}
        onClose={() => {
          setAddSectionOpen(false);
        }}
      />
      <Box
        w="full"
        rounded="xl"
        p="8"
        borderWidth="2px"
        borderColor="gray.200"
        bg="white"
        shadow="lg"
        _dark={{ borderColor: "gray.750", bg: "gray.800" }}
      >
        <Flex
          justifyContent={{ base: "start", lg: "space-between" }}
          gap="4"
          flexDir={{
            base: "column",
            md: "row",
          }}
        >
          <Stack spacing="8">
            <HStack spacing="6" flexDir={{ base: "column", lg: "row" }}>
              <Box w="max-content">
                <GhostGroup />
              </Box>
              <Stack spacing="1">
                <Heading
                  fontSize="lg"
                  fontWeight={600}
                  color="gray.800"
                  _dark={{
                    color: "gray.200",
                  }}
                >
                  It&apos;s looking a little lonely in here...
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Invite your students to join this class to get started.
                </Text>
                <HStack
                  maxW="375px"
                  spacing="3"
                  mt="4"
                  flexDir={{
                    base: "column",
                    sm: "row",
                  }}
                  alignItems={{
                    base: "start",
                    sm: "center",
                  }}
                >
                  {initialSection ? (
                    <Box color="inherit" w="160px" minW="160px">
                      <SectionSelect
                        size="sm"
                        sections={class_?.sections || []}
                        onChange={(s) => {
                          setSection(s);
                        }}
                        value={selectedSection}
                      />
                    </Box>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<IconNewSection size={16} />}
                      onClick={() => setAddSectionOpen(true)}
                    >
                      Create a section
                    </Button>
                  )}
                  {initialSection && (
                    <Skeleton rounded="md" isLoaded={!!code}>
                      <InputGroup>
                        <Input size="sm" value={`quenti.io/j${code}`} />
                        <InputRightElement boxSize="32px">
                          <TooltipWithTouch
                            label={copied ? "Copied!" : "Copy link"}
                            placement="top"
                            fontSize="xs"
                            onMouseLeave={() => setCopied(false)}
                          >
                            <IconButton
                              rounded="md"
                              colorScheme="gray"
                              aria-label="Copy link"
                              variant="ghost"
                              icon={<IconCopy size={16} />}
                              size="xs"
                              onClick={async () => {
                                await navigator.clipboard.writeText(
                                  `${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`,
                                );
                                setCopied(true);
                              }}
                            />
                          </TooltipWithTouch>
                        </InputRightElement>
                      </InputGroup>
                    </Skeleton>
                  )}
                </HStack>
              </Stack>
            </HStack>
          </Stack>
          <Center
            flex={{ base: "inherit", sm: 1, lg: "inherit" }}
            mt={{ base: 4, md: 0 }}
          >
            <Box
              maxW="375px"
              w={{ base: "full", md: "auto" }}
              visibility={initialSection ? "visible" : "hidden"}
            >
              <Box overflow="hidden" rounded="md" shadow="xl" w="max">
                {!!code ? (
                  <QR
                    text={`${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`}
                    options={{ width: 112, margin: 2 }}
                  />
                ) : (
                  <Center w={112} h={112}>
                    <Spinner size="sm" color="blue.200" />
                  </Center>
                )}
              </Box>
            </Box>
          </Center>
        </Flex>
      </Box>
    </>
  );
};
