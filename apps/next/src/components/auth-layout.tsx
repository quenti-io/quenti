import {
  Box,
  Button,
  Center,
  Container,
  Fade,
  Heading,
  Stack,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "../../../../packages/components/logo";
import { getSafeRedirectUrl } from "../lib/urls";
import { Link } from "@quenti/components";
import { Loading } from "./loading";

export interface AuthLayoutProps {
  mode: "login" | "signup";
  onUserExists: (callbackUrl: string) => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  mode,
  onUserExists,
}) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const callbackUrl =
    typeof router.query.callbackUrl == "string"
      ? router.query.callbackUrl
      : "/home";
  const safeCallbackUrl = getSafeRedirectUrl(callbackUrl);

  React.useEffect(() => {
    if (session?.user) onUserExists(safeCallbackUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const loading = status == "loading" || session?.user;

  const verb = mode == "signup" ? "up" : "in";
  const gradient = useColorModeValue(
    "linear(to-t, gray.50, blue.300)",
    "linear(to-t, gray.1000, blue.300)"
  );
  const gradientOpacity = useColorModeValue("0.3", "0.1");
  const termsColor = useColorModeValue("gray.400", "gray.600");

  return (
    <Center h="100vh" w="full" position="relative">
      <Fade
        in
        transition={{
          enter: {
            duration: 1.5,
            delay: 0.2,
            ease: "easeOut",
          },
        }}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="50vh"
          opacity={gradientOpacity}
          bgGradient={gradient}
        />
      </Fade>
      {!loading ? (
        <Container w="sm" zIndex={10}>
          <Fade
            in
            initial={{
              opacity: -1,
              transform: "translateY(-16px)",
            }}
            animate={{
              opacity: 1,
              transform: "translateY(0)",
              transition: {
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut",
              },
            }}
          >
            <VStack spacing="8">
              <Logo width={20} height={20} />
              <Heading fontSize="24px" textAlign="center">
                {mode == "signup"
                  ? "Create your Quenti account"
                  : "Welcome back"}
              </Heading>
              <Stack spacing="3" w="full">
                <Button
                  size="lg"
                  fontSize="sm"
                  leftIcon={<IconBrandGoogle size={18} strokeWidth={4} />}
                  onClick={async () => {
                    await signIn("google", {
                      callbackUrl: safeCallbackUrl,
                      redirect: false,
                    });
                  }}
                >
                  Sign {verb} with Google
                </Button>
                <Tooltip label="Coming soon">
                  <Button
                    size="lg"
                    fontSize="sm"
                    variant="outline"
                    colorScheme="gray"
                    cursor="not-allowed"
                  >
                    Sign {verb} with email
                  </Button>
                </Tooltip>
              </Stack>
              {mode == "signup" && (
                <Text textAlign="center" fontSize="sm" color={termsColor}>
                  By signing up, you agree to the{" "}
                  <Link
                    href="/terms"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Terms of Service
                  </Link>
                  .
                </Text>
              )}
            </VStack>
          </Fade>
        </Container>
      ) : (
        <Loading />
      )}
    </Center>
  );
};
