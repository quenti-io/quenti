import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconLock } from "@tabler/icons-react";
import { Link } from "../../components/link";

export const SetPrivate = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12}>
        <VStack spacing={4}>
          <IconLock />
          <Heading>This set is private</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>We can&apos;t show you any further details.</Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
