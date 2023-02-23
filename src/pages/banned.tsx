import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import type { ComponentWithAuth } from "../components/auth-component";
import { Loading } from "../components/loading";

const Banned: ComponentWithAuth = () => {
  const router = useRouter();
  const session = useSession();

  React.useEffect(() => {
    if (session?.data?.user && !session.data.user.banned) {
      void (async () => {
        await router.push("/home");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.data?.user, session?.data?.user?.banned]);

  if (!session.data || !session.data.user?.banned) return <Loading />;

  return (
    <>
      <Center height="calc(100vh - 120px)" textAlign="center" px="8">
        <VStack color="whiteAlpha.900">
          <Heading
            fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
            bgGradient="linear(to-r, blue.300, purple.300)"
            bgClip="text"
          >
            You Have Been Banned
          </Heading>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            color="gray.500"
            fontWeight={600}
          >
            If you believe this was a mistake, contact Ethan.
          </Text>
        </VStack>
      </Center>
    </>
  );
};

Banned.title = "Banned";
Banned.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Banned;
