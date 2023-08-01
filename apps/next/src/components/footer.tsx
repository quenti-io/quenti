import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Kbd,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconBrandGoogle, IconSpeakerphone } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { menuEventChannel } from "../events/menu";
import { MOD } from "../lib/tinykeys";
import { Authed } from "./authed";

export const Footer = () => {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Container
      maxW="100vw"
      as="footer"
      bg={useColorModeValue("white", "gray.800")}
      borderTop="2px"
      borderTopColor={useColorModeValue("gray.200", "gray.750")}
    >
      <Container maxW="7xl" py="10">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Quenti</Heading>
          <HStack gap={2}>
            <Authed
              fallback={
                <Button
                  size="sm"
                  display={{ base: "none", md: "flex" }}
                  leftIcon={<IconBrandGoogle size={16} stroke="4px" />}
                  onClick={async () => await signIn("google")}
                >
                  Sign up for free
                </Button>
              }
              nullOnLoad
            >
              <Button
                variant="outline"
                size="sm"
                color="gray.500"
                display={{ base: "none", md: "flex" }}
                onClick={() => {
                  window.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      key: "k",
                      code: "KeyK",
                      ctrlKey: MOD == "Control",
                      metaKey: MOD == "Meta",
                      shiftKey: false,
                    })
                  );
                }}
              >
                <HStack>
                  <Text color={textColor}>Command Menu</Text>
                  <Text color={textColor}>
                    <Kbd>{MOD == "Control" ? "Ctrl" : "⌘"}</Kbd> + <Kbd>K</Kbd>
                  </Text>
                </HStack>
              </Button>
            </Authed>
            <Button
              variant="outline"
              size="sm"
              color="blue.300"
              leftIcon={<IconSpeakerphone size={18} />}
              onClick={() => {
                menuEventChannel.emit("openChangelog");
              }}
            >
              <Text color={textColor}>What&apos;s New</Text>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Container>
  );
};
