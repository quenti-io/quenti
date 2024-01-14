import Link from "next/link";

import { Button, Heading, Text, VStack } from "@chakra-ui/react";

import { IconArrowBackUp } from "@tabler/icons-react";

import { GhostGroup } from "./ghost-group";

interface GhostMessageProps {
  message: string;
  subheading?: string | React.ReactNode;
  homeButton?: boolean;
}

export const GhostMessage: React.FC<GhostMessageProps> = ({
  message,
  subheading,
  homeButton,
}) => {
  return (
    <VStack spacing="8" textAlign="center" px="4">
      <VStack color="gray.700" _dark={{ color: "gray.300" }} spacing="4">
        <GhostGroup />
        <Heading color="gray.700" _dark={{ color: "gray.300" }}>
          {message}
        </Heading>
        {subheading && (
          <Text color="gray.500" fontWeight={500}>
            {subheading}
          </Text>
        )}
      </VStack>
      {homeButton && (
        <Button
          variant="outline"
          leftIcon={<IconArrowBackUp size={18} />}
          as={Link}
          href="/home"
        >
          Go home
        </Button>
      )}
    </VStack>
  );
};
