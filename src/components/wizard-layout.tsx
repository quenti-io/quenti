import {
  Container,
  Heading,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { SegmentedProgress } from "./segmented-progress";

export interface WizardLayoutProps {
  title: string;
  description: string;
  steps: number;
  currentStep: number;
}

export const WizardLayout: React.FC<
  React.PropsWithChildren<WizardLayoutProps>
> = ({ title, description, steps, currentStep, children }) => {
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="2xl" mt="10">
      <Stack>
        <Stack spacing="8" p="8">
          <Stack spacing="4">
            <Heading size="lg">{title}</Heading>
            <Text color={text}>{description}</Text>
          </Stack>
          <Stack>
            <Text color={text} fontSize="sm" fontWeight={600}>
              Step {currentStep + 1} of {steps}
            </Text>
            <SegmentedProgress steps={steps} currentStep={currentStep} />
          </Stack>
        </Stack>
        <SlideFade
          initial={{
            opacity: 0,
            transform: "translateY(-20px)",
          }}
          animate={{
            opacity: 1,
            transform: "translateY(0)",
          }}
          in
        >
          {children}
        </SlideFade>
      </Stack>
    </Container>
  );
};
