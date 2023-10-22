import { Link } from "@quenti/components";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

import { IconHelpHexagon } from "@tabler/icons-react";

export const Profile404 = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12} textAlign="center" px="8">
        <VStack spacing={4}>
          <IconHelpHexagon />
          <Heading>We couldn&apos;t find this profile</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>
            They might have changed their username, or deleted their account.
          </Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
