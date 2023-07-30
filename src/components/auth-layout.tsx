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
import React from "react";
import { Logo } from "../icons/logo";
import { Loading } from "./loading";
import { Link } from "./link";

export interface AuthLayoutProps {
  mode: "login" | "signup";
  onUserExists: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  mode,
  onUserExists,
}) => {
  const { status, data: session } = useSession();

  React.useEffect(() => {
    if (session?.user) onUserExists();
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
      <Box
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="50vh"
        opacity={gradientOpacity}
        bgGradient={gradient}
      />
      {!loading ? (
        <Container w="sm" zIndex={10}>
          <Fade
            in
            initial={{
              opacity: -1,
              translateY: -16,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: {
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
                      callbackUrl: "/home",
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
