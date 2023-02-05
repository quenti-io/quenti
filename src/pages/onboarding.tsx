import { Center, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ComponentWithAuth } from "../components/auth-component";
import { ChangeUsernameInput } from "../components/change-username-input";

const Onboarding: ComponentWithAuth = () => {
  const router = useRouter();

  return (
    <Center h="calc(100vh - 120px)">
      <Container maxW="2xl">
        <VStack spacing={12} textAlign="center">
          <VStack spacing={6}>
            <Heading size="3xl">👋</Heading>
            <Heading size="3xl">Welcome to Quizlet.cc!</Heading>
            <Text fontSize="lg">
              Pick a username to get started. You can change this any time in
              settings.
            </Text>
          </VStack>
          <ChangeUsernameInput
            disabledIfUnchanged={false}
            onChange={() => {
              void (async () => {
                await router.push(`/home`);
              })();
            }}
          />
        </VStack>
      </Container>
    </Center>
  );
};

Onboarding.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Onboarding;
