import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../components/animated-icons/check";
import { AnimatedXCircle } from "../components/animated-icons/x";
import type { ComponentWithAuth } from "../components/auth-component";
import { USERNAME_REGEXP } from "../constants/characters";
import { useDebounce } from "../hooks/use-debounce";
import { api } from "../utils/api";

const Onboarding: ComponentWithAuth = () => {
  const router = useRouter();
  const session = useSession();

  const inputBg = useColorModeValue("gray.200", "gray.750");
  const addonBg = useColorModeValue("gray.300", "gray.700");

  const [usernameValue, setUsernameValue] = React.useState(
    session.data!.user!.username
  );
  const debouncedUsername = useDebounce(usernameValue, 500);

  const checkUsername = api.user.checkUsername.useQuery(debouncedUsername, {
    enabled: !!debouncedUsername.length,
  });
  const changeUsername = api.user.changeUsername.useMutation({
    onSuccess: async () => {
      await router.push(`/home`);
    },
  });

  const gray = useColorModeValue("gray.500", "gray.400");
  const green = useColorModeValue("green.400", "green.300");
  const red = useColorModeValue("red.400", "red.300");

  const isInvalid = !USERNAME_REGEXP.test(usernameValue);

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
          <Stack gap={2}>
            <HStack gap={2}>
              <InputGroup size="lg">
                <Input
                  fontWeight={700}
                  variant="flushed"
                  placeholder="Enter a username"
                  bg={inputBg}
                  rounded="md"
                  px="4"
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
                  isInvalid={isInvalid}
                  _focus={{
                    borderColor: isInvalid ? "red.300" : "orange.300",
                    boxShadow: `0px 1px 0px 0px ${
                      isInvalid ? "#fc8181" : "#ffa54c"
                    }`,
                  }}
                />
                <InputRightAddon
                  bg={addonBg}
                  px="3"
                  color={
                    checkUsername.isLoading
                      ? gray
                      : checkUsername.data
                      ? green
                      : red
                  }
                >
                  {checkUsername.isLoading && !isInvalid ? (
                    <Box w="24px"></Box>
                  ) : checkUsername.data ? (
                    <AnimatedCheckCircle />
                  ) : (
                    <AnimatedXCircle />
                  )}
                </InputRightAddon>
              </InputGroup>
              <Button
                size="lg"
                isDisabled={
                  isInvalid || checkUsername.isLoading || !checkUsername.data
                }
                onClick={() => changeUsername.mutate(usernameValue)}
                isLoading={changeUsername.isLoading}
              >
                Done
              </Button>
            </HStack>
            <Text
              fontSize="sm"
              textAlign="left"
              color={gray}
              visibility={isInvalid ? "visible" : "hidden"}
            >
              Only letters, numbers, underscores and dashes allowed.
            </Text>
          </Stack>
        </VStack>
      </Container>
    </Center>
  );
};

Onboarding.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Onboarding;
