import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Logo } from "../../icons/logo";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingIntro = () => {
  const router = useRouter();

  return (
    <PresentWrapper step={0}>
      <VStack spacing={6} textAlign="center">
        <Logo width="80px" height="80px" />
        <Heading size="3xl">Welcome to Quenti</Heading>
        <Text fontWeight={500}>
          {/* TODO: eh */}
          Quenti is your all-in-one integrated learning platform for students
          and teachers.
        </Text>
        <Button
          mt="4"
          w="72"
          size="lg"
          onClick={async () => {
            await router.push("/onboarding/theme");
          }}
        >
          Get started
        </Button>
      </VStack>
    </PresentWrapper>
  );
};
