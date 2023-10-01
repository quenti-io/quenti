import { FrameLogo, Link } from "@quenti/components";
import { GithubIcon, XIcon } from "@quenti/components/icons";

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Kbd,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconCopyright, IconMoon, IconSun } from "@tabler/icons-react";

import { MOD } from "../lib/tinykeys";
import { Authed } from "./authed";

export const Footer = () => {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Container
      maxW="100vw"
      as="footer"
      bg="white"
      _dark={{
        bg: "gray.850",
      }}
      borderTop="1px"
      borderTopColor={useColorModeValue("gray.200", "gray.750")}
    >
      <Container maxW="7xl" py="10">
        <Stack spacing="8">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack spacing="3">
              <Link href="/">
                <HStack>
                  <FrameLogo width="18px" height="18px" />
                  <Heading size="md">Quenti</Heading>
                </HStack>
              </Link>
              <HStack
                spacing="1"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
              >
                <IconCopyright size={12} />
                <Text fontSize="sm">2023</Text>
              </HStack>
            </HStack>
            <HStack spacing="4">
              <Authed nullOnLoad>
                <Button
                  variant="outline"
                  size="sm"
                  color="gray.500"
                  colorScheme="gray"
                  display={{ base: "none", md: "flex" }}
                  onClick={() => {
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "k",
                        code: "KeyK",
                        ctrlKey: MOD == "Control",
                        metaKey: MOD == "Meta",
                        shiftKey: false,
                      }),
                    );
                  }}
                >
                  <HStack>
                    <Text color={textColor}>Command menu</Text>
                    <Text color={textColor}>
                      <Kbd>{MOD == "Control" ? "Ctrl" : "⌘"}</Kbd> +{" "}
                      <Kbd>K</Kbd>
                    </Text>
                  </HStack>
                </Button>
              </Authed>
              <Box display={{ base: "none", lg: "inherit" }}>
                <ThemeSwitcher />
              </Box>
            </HStack>
          </Flex>
          <HStack
            justifyContent="space-between"
            w="full"
            display={{
              base: "grid",
              lg: "flex",
            }}
            gridTemplateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
          >
            <Box display={{ base: "none", lg: "inherit" }}>
              <SocialLinksContainer />
            </Box>
            <FooterLink href="/" text="Home" />
            <FooterLink href="/pricing" text="Pricing" />
            <FooterLink
              href="https://github.com/quenti-io/quenti"
              text="Open source"
            />
            <FooterLink href="https://status.quenti.io" text="Status" />
            <FooterLink href="/organizations" text="Organizations" />
            <FooterLink
              href="mailto:support@quenti.io"
              text="Contact support"
            />
            <FooterLink href="/privacy" text="Privacy Policy" />
            <FooterLink href="/terms" text="Terms of Service" />
            <FooterLink
              href="https://github.com/quenti-io/quenti/blob/main/LICENSE"
              text="License"
            />
          </HStack>
          <Flex
            display={{ base: "inherit", lg: "none" }}
            justifyContent="space-between"
          >
            <SocialLinksContainer />
            <ThemeSwitcher />
          </Flex>
        </Stack>
      </Container>
    </Container>
  );
};

const SocialLinksContainer = () => {
  return (
    <HStack spacing="3">
      <SocialLink href="https://github.com/quenti-io">
        <GithubIcon w="4" h="4" />
      </SocialLink>
      <SocialLink href="https://twitter.com/quentiapp">
        <XIcon w="4" h="4" />
      </SocialLink>
    </HStack>
  );
};

const ThemeSwitcher = () => {
  return (
    <HStack color="gray.500" spacing="0">
      <ThemeButton mode="light" />
      <ThemeButton mode="dark" />
    </HStack>
  );
};

const ThemeButton = ({ mode }: { mode: "light" | "dark" }) => {
  const { colorMode, setColorMode } = useColorMode();
  const Icon = mode == "dark" ? IconMoon : IconSun;

  const selected = colorMode == mode;

  return (
    <Box
      cursor="pointer"
      color={selected ? "gray.900" : "gray.400"}
      bg={selected ? "gray.100" : "transparent"}
      _hover={{
        color: "gray.900",
      }}
      _dark={{
        color: selected ? "gray.50" : "gray.500",
        bg: selected ? "gray.750" : "transparent",
        _hover: {
          color: "gray.50",
        },
      }}
      transition="color 0.15s ease-in-out"
      p="6px"
      rounded="full"
      onClick={() => setColorMode(mode)}
    >
      <Icon size={18} />
    </Box>
  );
};

interface FooterLinkProps {
  href: string;
  text: string;
}

const SocialLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => {
  return (
    <Link
      color="gray.500"
      _hover={{
        color: "gray.900",
      }}
      _dark={{
        _hover: {
          color: "gray.50",
        },
      }}
      transition="color 0.15s ease-in-out"
      href={href}
    >
      {children}
    </Link>
  );
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, text }) => {
  return (
    <Link href={href}>
      <Text
        color="gray.500"
        transition="all ease-in-out 150ms"
        fontSize="sm"
        fontWeight={500}
        _hover={{
          color: "gray.900",
        }}
        _dark={{
          _hover: {
            color: "gray.50",
          },
        }}
      >
        {text}
      </Text>
    </Link>
  );
};
