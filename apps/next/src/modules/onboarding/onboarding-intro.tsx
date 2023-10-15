import { motion } from "framer-motion";
import React from "react";

import { BODY_COPY_BASE } from "@quenti/branding";
import { HeadSeo } from "@quenti/components";

import { Button, Heading, Text, VStack } from "@chakra-ui/react";

import { Logo } from "../../../../../packages/components/logo";
import { LazyWrapper } from "../../common/lazy-wrapper";
import { useTelemetry } from "../../lib/telemetry";
import { PresentWrapper, useNextStep } from "./present-wrapper";

const ghost = {
  transition: {
    repeat: Infinity,
    duration: 5,
    ease: "backInOut",
  },
  animate: {
    translateY: [0, -20, 0],
  },
};

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
      <LazyWrapper>
        <PresentWrapper>
          <Intro />
        </PresentWrapper>
      </LazyWrapper>
    </>
  );
};

const Intro = () => {
  const next = useNextStep();

  return (
    <VStack spacing={6} textAlign="center">
      <motion.div {...ghost}>
        <Logo width={24} height={24} />
      </motion.div>
      <Heading size="3xl">Welcome to Quenti</Heading>
      <Text fontWeight={500}>{BODY_COPY_BASE}</Text>
      <Button mt="4" w="72" size="lg" onClick={next}>
        Get started
      </Button>
    </VStack>
  );
};
