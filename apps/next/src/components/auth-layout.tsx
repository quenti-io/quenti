import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";
import { WEBSITE_URL } from "@quenti/lib/constants/url";

import {
  Box,
  Button,
  Center,
  Container,
  Fade,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBrandGoogleFilled,
  IconPinned,
  IconWand,
} from "@tabler/icons-react";

import { Logo } from "../../../../packages/components/logo";
import { LazyWrapper } from "../common/lazy-wrapper";
import { useTelemetry } from "../lib/telemetry";
import { getSafeRedirectUrl } from "../lib/urls";
import { Loading } from "./loading";

export interface AuthLayoutProps {
  mode: "login" | "signup";
  onUserExists: (callbackUrl: string) => void;
}

interface EmailFormInputs {
  email: string;
}

const schema = z.object({
  email: z.string().email(),
});

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  mode,
  onUserExists,
}) => {
  const router = useRouter();
  const { event } = useTelemetry();
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

  const emailMethods = useForm<EmailFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const {
    formState: { errors },
  } = emailMethods;

  const calculateMargin = () => {
    const vh = window.innerHeight;
    const margin = vh / 2 - 200;
    return margin;
  };

  React.useEffect(() => {
    if (typeof window == "undefined") return;
    setMargin(calculateMargin());

    const handleResize = () => {
      setMargin(calculateMargin());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [margin, setMargin] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [animationFinished, setAnimationFinished] = React.useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = React.useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
    setMagicLinkLoading(true);
    await signIn("magic", {
      email: data.email,
    });
  };

  const verb = mode == "signup" ? "up" : "in";
  const gradient = useColorModeValue(
    "linear(to-t, gray.50, blue.300)",
    "linear(to-t, gray.1000, blue.300)",
  );
  const gradientOpacity = useColorModeValue("0.3", "0.1");
  const termsColor = useColorModeValue("gray.400", "gray.600");

  return (
    <>
      <HeadSeo title={mode == "login" ? "Log in" : "Sign up"} />
      <LazyWrapper>
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
            <Flex h="100vh" w="full" position="relative" pt={`${margin}px`}>
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
                    <Logo width={24} height={24} />
                    <Heading fontSize="24px" textAlign="center">
                      {mode == "signup"
                        ? "Create your Quenti account"
                        : "Welcome back"}
                    </Heading>
                    <form
                      style={{
                        width: "100%",
                      }}
                      onSubmit={emailMethods.handleSubmit(onSubmit)}
                    >
                      <Stack spacing="3" w="full">
                        <Button
                          size="lg"
                          fontSize="sm"
                          shadow="0 4px 6px -1px rgba(0, 0, 0, 0.04),0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                          leftIcon={<IconBrandGoogleFilled size={18} />}
                          onClick={async () => {
                            if (mode == "signup") {
                              await event("signup", {});
                            } else {
                              await event("login", {});
                            }

                            await signIn("google", {
                              callbackUrl: safeCallbackUrl,
                              redirect: false,
                            });
                          }}
                        >
                          Sign {verb} with Google
                        </Button>
                        <Box>
                          <Stack
                            my={expanded ? 4 : 0}
                            mb={expanded ? 3 : 0}
                            h={expanded ? "74px" : "0px"}
                            overflow="hidden"
                            px="1"
                            w="calc(100% + 8px)"
                            ml="-1"
                            transition="all 0.15s ease-in-out"
                          >
                            <Box
                              top="0"
                              w="full"
                              minH="2px"
                              bg="gray.100"
                              _dark={{
                                bg: "gray.750",
                              }}
                              rounded="full"
                              mb="3"
                            />
                            <Controller
                              name="email"
                              control={emailMethods.control}
                              render={({ field: { value, onChange } }) => (
                                <FormControl isInvalid={!!errors.email}>
                                  <Input
                                    ref={emailInputRef}
                                    value={value}
                                    onChange={onChange}
                                    mt="2"
                                    minH="40px"
                                    placeholder="Enter your email address"
                                    fontSize="sm"
                                    borderColor="gray.300"
                                    _dark={{
                                      borderColor: "gray.600",
                                    }}
                                  />
                                </FormControl>
                              )}
                            ></Controller>
                          </Stack>
                          <Button
                            w="full"
                            size="lg"
                            fontSize="sm"
                            variant="outline"
                            shadow="0 4px 6px -1px rgba(0, 0, 0, 0.04),0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                            colorScheme="gray"
                            onClick={() => {
                              if (!expanded) {
                                setExpanded(true);
                                setTimeout(() => {
                                  setAnimationFinished(true);
                                  emailInputRef.current?.focus();
                                }, 200);
                              }
                            }}
                            type={animationFinished ? "submit" : undefined}
                            overflow="hidden"
                            isLoading={magicLinkLoading}
                          >
                            <Stack
                              h="48px"
                              transform={
                                expanded
                                  ? "translateY(0px)"
                                  : "translateY(-48px)"
                              }
                              transition="all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
                              spacing="0"
                            >
                              <Center minH="48px">
                                <HStack>
                                  <IconWand size={16} />
                                  <Text>Send me a magic link</Text>
                                </HStack>
                              </Center>
                              <Center minH="48px">
                                <Text>Sign {verb} with email</Text>
                              </Center>
                            </Stack>
                          </Button>
                        </Box>
                      </Stack>
                    </form>
                    <Flex gap="6px" ml="-2px">
                      <Box mt="2px">
                        <IconPinned size={18} />
                      </Box>
                      <Stack spacing="1">
                        <Text fontWeight={700} fontSize="sm">
                          If Google has blocked your school&apos;s access
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          No worries, sign {verb} with email instead, and
                          we&apos;ll send you a link to instantly log in.
                        </Text>
                      </Stack>
                    </Flex>
                    {mode == "signup" && (
                      <Text
                        textAlign="center"
                        fontSize="xs"
                        color={termsColor}
                        maxW="260px"
                        mt="-4"
                      >
                        By signing up, you agree to the{" "}
                        <Link
                          href={`${WEBSITE_URL}/terms`}
                          _hover={{
                            textDecoration: "underline",
                          }}
                        >
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          href={`${WEBSITE_URL}/privacy`}
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
            </Flex>
          ) : (
            <Loading />
          )}
        </Center>
      </LazyWrapper>
    </>
  );
};
