import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import { Flex, Heading, SkeletonText, Stack, Text } from "@chakra-ui/react";

import { SegmentedProgress } from "../../components/segmented-progress";
import { useClass } from "../../hooks/use-class";
import { useProtectedRedirect } from "./use-protected-redirect";

export interface ClassWizardLayout {
  title: string;
  seoTitle?: string;
  description: string | React.ReactNode;
  steps: number;
  currentStep: number;
}

export const ClassWizardLayout: React.FC<
  React.PropsWithChildren<ClassWizardLayout>
> = ({ title, seoTitle, description, steps, currentStep, children }) => {
  const { data: class_ } = useClass();
  const isLoaded = useProtectedRedirect();

  return (
    <>
      {seoTitle && isLoaded && (
        <HeadSeo
          title={`${seoTitle} - ${class_.name}`}
          description={description?.toString()}
          nextSeoProps={{
            noindex: true,
            nofollow: true,
          }}
        />
      )}
      <Stack spacing="8">
        <Stack spacing="8">
          <Stack>
            <SegmentedProgress
              steps={steps}
              currentStep={isLoaded ? currentStep : -1}
            />
          </Stack>
          <Stack spacing="4">
            <Stack spacing="1">
              <Flex h="21px" alignItems="center">
                <SkeletonText
                  noOfLines={1}
                  fitContent
                  w="max"
                  isLoaded={isLoaded}
                  skeletonHeight="16px"
                >
                  <Text
                    color="gray.600"
                    _dark={{
                      color: "gray.400",
                    }}
                    fontSize="sm"
                    fontWeight={600}
                  >
                    Step {currentStep + 1} of {steps}
                  </Text>
                </SkeletonText>
              </Flex>

              <Flex h="36px" alignItems="center">
                <SkeletonText
                  isLoaded={isLoaded}
                  skeletonHeight="26px"
                  w="max"
                  noOfLines={1}
                >
                  <Heading size="lg">{title}</Heading>
                </SkeletonText>
              </Flex>
            </Stack>
            <Text
              color="gray.600"
              _dark={{
                color: "gray.400",
              }}
              whiteSpace="pre-wrap"
            >
              {description}
            </Text>
          </Stack>
        </Stack>
        {children}
      </Stack>
    </>
  );
};
