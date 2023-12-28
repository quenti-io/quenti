import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import {
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { SegmentedProgress } from "../../components/segmented-progress";
import { useClass } from "../../hooks/use-class";
import { useProtectedRedirect } from "./use-protected-redirect";

export interface ClassWizardLayout {
  title: string;
  seoTitle?: string;
  description: string | React.ReactNode;
  steps: number;
  currentStep: number;
  isLoaded?: boolean;
}

export const ClassWizardLayout: React.FC<
  React.PropsWithChildren<ClassWizardLayout>
> = ({
  title,
  seoTitle,
  description,
  steps,
  currentStep,
  children,
  ...props
}) => {
  const { data: class_ } = useClass();
  const _isLoaded = useProtectedRedirect();

  const isLoaded = props.isLoaded !== undefined ? props.isLoaded : _isLoaded;

  return (
    <>
      {seoTitle && isLoaded && (
        <HeadSeo
          title={`${seoTitle} - ${class_!.name}`}
          description={description?.toString()}
          nextSeoProps={{
            noindex: true,
            nofollow: true,
          }}
        />
      )}
      <Stack spacing="8" mt="2">
        <Stack spacing="6">
          <Stack w="full" spacing="3">
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
            <Skeleton rounded="full" isLoaded={isLoaded}>
              <SegmentedProgress
                steps={steps}
                currentStep={isLoaded ? currentStep : currentStep - 1}
              />
            </Skeleton>
          </Stack>
          <Stack spacing="5">
            <Stack spacing="1">
              <Flex h="36px" alignItems="center">
                <SkeletonText
                  isLoaded={isLoaded}
                  skeletonHeight="26px"
                  w="max"
                  noOfLines={1}
                >
                  <Heading fontSize="3xl">{title}</Heading>
                </SkeletonText>
              </Flex>
            </Stack>
            <Skeleton fitContent isLoaded={isLoaded}>
              <Text
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
                whiteSpace="pre-wrap"
              >
                {description}
              </Text>
            </Skeleton>
          </Stack>
        </Stack>
        {children}
      </Stack>
    </>
  );
};
