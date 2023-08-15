import { Button, Heading, Text, VStack } from "@chakra-ui/react";

import { Logo } from "../../../../../packages/components/logo";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingIntro = () => {
  return (
    <PresentWrapper>
      <Intro />
    </PresentWrapper>
  );
};

const Intro = () => {
  const next = useNextStep();

  return (
    <VStack spacing={6} textAlign="center">
      <Logo width="80px" height="80px" />
      <Heading size="3xl">Welcome to Quenti</Heading>
      <Text fontWeight={500}>
        {/* TODO: eh */}
        Quenti is your all-in-one integrated learning platform for students and
        teachers.
      </Text>
      <Button mt="4" w="72" size="lg" onClick={next}>
        Get started
      </Button>
    </VStack>
  );
};
