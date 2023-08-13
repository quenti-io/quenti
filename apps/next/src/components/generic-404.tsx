import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconHelpHexagon } from "@tabler/icons-react";
import { Link } from "@quenti/components";

export const Generic404 = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12} textAlign="center" px="8">
        <VStack spacing={4}>
          <IconHelpHexagon />
          <Heading>We can&apos;t find what you&apos;re looking for</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>Please check the URL and try again.</Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
