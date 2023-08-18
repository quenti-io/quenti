import { BODY_COPY_BASE } from "@quenti/branding";
import { HeadSeo } from "@quenti/components";

import { Button, Heading, Text, VStack } from "@chakra-ui/react";

import { Logo } from "../../../../../packages/components/logo";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingIntro = () => {
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
      <Logo width="80px" height="80px" />
      <Heading size="3xl">Welcome to Quenti</Heading>
      <Text fontWeight={500}>{BODY_COPY_BASE}</Text>
      <Button mt="4" w="72" size="lg" onClick={next}>
        Get started
      </Button>
    </VStack>
  );
};
