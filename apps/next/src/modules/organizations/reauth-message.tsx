import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Link } from "@quenti/components";
import { WEBSITE_URL } from "@quenti/lib/constants/url";

import {
  Button,
  Center,
  SlideFade,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";
import { WithFooter } from "../../components/with-footer";

export interface ReauthMessage {
  title: string;
  message?: string;
}

export const ReauthMessage: React.FC<ReauthMessage> = ({
  title,
  message = "Sign in with your school/work email to get started.",
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <WithFooter>
      <Center h="calc(100vh - 240px)">
        <SlideFade in>
          <VStack spacing="10">
            <GhostMessage
              message={title}
              subheading={
                <>
                  {message}{" "}
                  <Link
                    href={`${WEBSITE_URL}/organizations`}
                    fontWeight={600}
                    transition="color 0.2s ease-in-out"
                    color="gray.600"
                    _hover={{ color: "blue.500" }}
                    _dark={{
                      color: "gray.400",
                      _hover: { color: "blue.200" },
                    }}
                  >
                    Learn more
                  </Link>
                  .
                </>
              }
            />
            <Text color="gray.500" textAlign="center">
              You are currently logged in as{" "}
              <chakra.strong
                fontWeight={600}
                color="gray.900"
                _dark={{
                  color: "gray.50",
                }}
              >
                {session?.user?.email || ""}
              </chakra.strong>
            </Text>
            <Button
              bg="black"
              _hover={{
                bg: "gray.700",
              }}
              _dark={{
                color: "gray.900",
                bg: "gray.100",
                _hover: {
                  bg: "gray.200",
                },
              }}
              py="6"
              onClick={async () => {
                await signOut({
                  callbackUrl: `/auth/login?callbackUrl=${router.asPath}`,
                });
              }}
            >
              Sign in with a different account
            </Button>
          </VStack>
        </SlideFade>
      </Center>
    </WithFooter>
  );
};
