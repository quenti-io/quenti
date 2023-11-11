import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

import GlobalShortcutLayer from "../../components/global-shortcut-layer";
import { useNextStep } from "./present-wrapper";

interface DefaultLayoutProps {
  heading: string;
  seoTitle: string;
  description: string | React.ReactNode;
  action?: string;
  defaultNext?: boolean;
  onNext?: () => void | Promise<void>;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextVariant?: "solid" | "outline" | "ghost" | "link";
}

export const DefaultLayout: React.FC<
  React.PropsWithChildren<DefaultLayoutProps>
> = ({
  heading,
  seoTitle,
  description,
  action = "Continue",
  defaultNext = true,
  onNext,
  nextDisabled,
  nextLoading,
  nextVariant,
  children,
}) => {
  const next = useNextStep();

  return (
    <Box>
      <HeadSeo
        title={seoTitle}
        description={description?.toLocaleString()}
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <GlobalShortcutLayer />
      <VStack spacing="12" px="4">
        <VStack spacing="4">
          <Heading size="lg" textAlign="center">
            {heading}
          </Heading>
          <Text
            color="gray.700"
            _dark={{
              color: "gray.300",
            }}
            fontSize="sm"
            textAlign="center"
          >
            {description}
          </Text>
        </VStack>
        {children}
        <Button
          w="72"
          size={{ base: "md", md: "lg" }}
          onClick={async () => {
            await onNext?.();
            if (defaultNext) next();
          }}
          isDisabled={nextDisabled}
          isLoading={nextLoading}
          variant={nextVariant}
        >
          {action}
        </Button>
      </VStack>
    </Box>
  );
};
