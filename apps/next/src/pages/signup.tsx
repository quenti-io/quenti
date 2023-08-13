import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconArrowLeft, IconBrandGoogle } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import deviceframesSrc from "public/assets/signup/deviceframes.png";
import React from "react";
import { Link } from "@quenti/components";
import { Loading } from "../components/loading";
import { StaticWrapper } from "../components/static-wrapper";

export default function Signup() {
  const router = useRouter();
  const { status, data: session } = useSession();

  React.useEffect(() => {
    void (async () => {
      if (session?.user) await router.push("/home");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  if (status == "loading" || session?.user) return <Loading />;

  return (
    <StaticWrapper>
      <Container maxW="7xl" px="8" h="calc(100vh - 80px)" overflow="hidden">
        <Flex direction={{ base: "column", md: "row" }}>
          <Box
            mt={{ base: "6", lg: "20" }}
            w={{ base: "auto", md: "8xl" }}
            zIndex={10}
          >
            <Center>
              <Stack spacing={14} maxW={{ base: 400, md: "unset" }}>
                <Stack spacing={8}>
                  <Stack spacing={4}>
                    <Button
                      variant="ghost"
                      w="max"
                      leftIcon={<IconArrowLeft size={18} />}
                      as={Link}
                      href="/"
                    >
                      Back
                    </Button>
                    <Heading
                      color="whiteAlpha.900"
                      size={{ base: "2xl", sm: "3xl" }}
                      bgGradient="linear(to-b, whiteAlpha.900, orange.400)"
                      bgClip="text"
                    >
                      We&apos;re currently invite only.
                    </Heading>
                  </Stack>
                  <Stack fontSize="lg">
                    <Text color="whiteAlpha.800" fontWeight={500}>
                      Sign up with your school Google account to get started.
                    </Text>
                    <Text color="whiteAlpha.600">
                      Want to use your personal email instead? Reach out to
                      Ethan to have your email verified.
                    </Text>
                  </Stack>
                </Stack>
                <Button
                  size="lg"
                  leftIcon={<IconBrandGoogle size={20} />}
                  colorScheme="orange"
                  onClick={async () =>
                    await signIn("google", { callbackUrl: "/home" })
                  }
                >
                  Sign up with Google
                </Button>
              </Stack>
            </Center>
          </Box>
          <Box
            height="calc(100vh - 80px)"
            overflow="hidden"
            mt={{ base: "-24", md: 0 }}
          >
            <Image src={deviceframesSrc} alt="device frames" />
          </Box>
        </Flex>
      </Container>
    </StaticWrapper>
  );
}
