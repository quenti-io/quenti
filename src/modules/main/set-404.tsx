import { Button, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { IconQuestionCircle } from "@tabler/icons-react";

export const Set404 = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12}>
        <VStack spacing={4}>
          <IconQuestionCircle />
          <Heading>We couldn&apos;t find this set</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>It might have been deleted by the original creator.</Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
