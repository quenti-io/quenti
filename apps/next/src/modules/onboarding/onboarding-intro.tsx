import React from "react";

import { BODY_COPY_BASE } from "@quenti/branding";
import { HeadSeo } from "@quenti/components";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

import { Logo } from "../../../../../packages/components/logo";
import { useTelemetry } from "../../lib/telemetry";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingIntro = () => {
  const { event } = useTelemetry();

  React.useEffect(() => {
    void event("onboarding_started", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadSeo
        title="Welcome to Quenti"
        hideTitleSuffix
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <PresentWrapper>
        <Intro />
      </PresentWrapper>
    </>
  );
};

const Intro = () => {
  const next = useNextStep();

  return (
    <VStack spacing={6} textAlign="center">
      <Center
        w="24"
        h="24"
        rounded="full"
        bgGradient="linear-gradient(to-tr, blue.400 50%, blue.200)"
        shadow="xl"
        color="white"
      >
        <Logo width={14} height={14} />
      </Center>
      <Heading size="3xl">Welcome to Quenti</Heading>
      <Text fontWeight={500}>{BODY_COPY_BASE}</Text>
      <Button mt="4" w="72" size="lg" onClick={next}>
        Get started
      </Button>
    </VStack>
  );
};
