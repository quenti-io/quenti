import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconArrowLeft, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import deviceframesSrc from "public/assets/signup/deviceframes.png";
import { StaticWrapper } from "../components/static-wrapper";

export default function Signup() {
  return (
    <StaticWrapper>
      <Container maxW="7xl" px="8" h="calc(100vh - 80px)" overflow="hidden">
        <Flex direction={{ base: "column", md: "row" }}>
          <Box mt={{ base: "6", lg: "20" }} w={{ base: "auto", md: "8xl" }}>
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
                      size="3xl"
                      bgGradient="linear(to-b, whiteAlpha.900, orange.400)"
                      bgClip="text"
                    >
                      We&apos;re currently invite only.
                    </Heading>
                  </Stack>
                  <Text color="whiteAlpha.700" fontSize="lg">
                    Only users with verfified email addresses can sign in and
                    access Quizlet.cc right now.
                  </Text>
                </Stack>
                <Button
                  size="lg"
                  leftIcon={<IconBrandGoogle size={20} />}
                  colorScheme="orange"
                  onClick={async () =>
                    await signIn("google", { callbackUrl: "/home" })
                  }
                >
                  Sign in with Google
                </Button>
              </Stack>
            </Center>
          </Box>
          <Box height="calc(100vh - 80px)" overflow="hidden">
            <Image src={deviceframesSrc} alt="device frames" />
          </Box>
        </Flex>
      </Container>
    </StaticWrapper>
  );
}
