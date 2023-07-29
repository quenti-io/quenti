import {
  Button,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface DefaultLayoutProps {
  heading: string;
  description: string | React.ReactNode;
  action?: string;
  nextUrl?: string;
  onNext?: () => void | Promise<void>;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextVariant?: "solid" | "outline" | "ghost" | "link";
}

export const DefaultLayout: React.FC<
  React.PropsWithChildren<DefaultLayoutProps>
> = ({
  heading,
  description,
  action = "Continue",
  nextUrl,
  onNext,
  nextDisabled,
  nextLoading,
  nextVariant,
  children,
}) => {
  const router = useRouter();

  const text = useColorModeValue("gray.700", "gray.300");

  return (
    <VStack spacing="12">
      <VStack spacing="4">
        <Heading size="lg">{heading}</Heading>
        <Text color={text} fontSize="sm">
          {description}
        </Text>
      </VStack>
      {children}
      <Button
        w="72"
        size="lg"
        onClick={async () => {
          if (nextUrl) await router.push(nextUrl);
          await onNext?.();
        }}
        isDisabled={nextDisabled}
        isLoading={nextLoading}
        variant={nextVariant}
      >
        {action}
      </Button>
    </VStack>
  );
};
