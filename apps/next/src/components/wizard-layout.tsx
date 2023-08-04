import {
  Container,
  Heading,
  Skeleton,
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
  enableSkeleton?: boolean;
  isLoaded?: boolean;
  cardIn?: boolean;
}

export const WizardLayout: React.FC<
  React.PropsWithChildren<WizardLayoutProps>
> = ({
  title,
  description,
  steps,
  currentStep,
  children,
  enableSkeleton,
  isLoaded,
  cardIn = true,
}) => {
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="2xl" pb="20">
      <Stack>
        <Stack spacing="8" p="8">
          <Stack>
            <Text color={text} fontSize="sm" fontWeight={600}>
              Step {currentStep + 1} of {steps}
            </Text>
            <SegmentedProgress steps={steps} currentStep={currentStep} />
          </Stack>
          <Stack spacing="4">
            <Heading size="lg">{title}</Heading>
            {enableSkeleton ? (
              <Skeleton isLoaded={isLoaded} fitContent>
                <Text color={text}>{description}</Text>
              </Skeleton>
            ) : (
              <Text color={text}>{description}</Text>
            )}
          </Stack>
        </Stack>
        <SlideFade
          initial={{
            opacity: 0,
            transform: "translateY(-20px)",
          }}
          animate={
            cardIn
              ? {
                  opacity: 1,
                  transform: "translateY(0)",
                }
              : undefined
          }
          in={cardIn}
        >
          {children}
        </SlideFade>
      </Stack>
    </Container>
  );
};
