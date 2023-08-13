import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconFolder } from "@tabler/icons-react";
import { Link } from "@quenti/components";

export const NoPublicSets = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12} textAlign="center" px="8">
        <VStack spacing={4}>
          <IconFolder />
          <Heading>We can&apos;t show you this folder</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>
            This folder does not contain any public sets you can view.
          </Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
