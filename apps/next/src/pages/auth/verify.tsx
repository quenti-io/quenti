import { Link, Logo } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";

import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { EnterWrapper } from "../../modules/auth/enter-wrapper";
import { AuthGradient } from "../../modules/auth/gradient";

export default function Verify() {
  return (
    <>
      <HeadSeo
        title="Check your inbox"
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <LazyWrapper>
        <Center h="100vh" w="full" position="relative">
          <AuthGradient />
          <EnterWrapper>
            <Container maxW="xl" w="full" zIndex={10}>
              <VStack spacing="8" textAlign="center">
                <Logo width={20} height={20} />
                <Heading fontSize="4xl">Check your inbox</Heading>
                <Text
                  fontWeight={500}
                  color="gray.700"
                  _dark={{
                    color: "gray.300",
                  }}
                >
                  We&apos;ve sent you a magic login link.
                  <br />
                  Please click the link to confirm your email.
                </Text>
                <Box
                  h="2px"
                  w="full"
                  bg="gray.200"
                  _dark={{
                    bg: "gray.750",
                  }}
                />
                <HStack>
                  <Button
                    variant="ghost"
                    colorScheme="gray"
                    fontSize="sm"
                    as={Link}
                    href="https://mail.google.com"
                    leftIcon={
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                        />
                      </svg>
                    }
                    color="gray.600"
                    _dark={{
                      color: "gray.400",
                    }}
                  >
                    Open Gmail
                  </Button>
                  <Button
                    variant="ghost"
                    colorScheme="gray"
                    fontSize="sm"
                    as={Link}
                    href="ms-outlook://"
                    leftIcon={
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z"
                        />
                      </svg>
                    }
                    color="gray.600"
                    _dark={{
                      color: "gray.400",
                    }}
                  >
                    Open Outlook
                  </Button>
                </HStack>
                <Text
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                  fontSize="xs"
                >
                  Can&apos;t see the email? Please check your spam folder.
                  <br />
                  Wrong email?{" "}
                  <Link
                    href="/auth/signup"
                    color="blue.300"
                    _hover={{
                      color: "blue.200",
                    }}
                    _dark={{
                      color: "blue.200",
                      _hover: {
                        color: "blue.100",
                      },
                    }}
                    transition="color 0.2s ease-in-out"
                    fontWeight={500}
                  >
                    Please re-enter your address.
                  </Link>
                </Text>
              </VStack>
            </Container>
          </EnterWrapper>
        </Center>
      </LazyWrapper>
    </>
  );
}

Verify.PageWrapper = PageWrapper;
