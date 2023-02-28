import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconFolder } from "@tabler/icons-react";
import { Link } from "../../components/link";

export const Folder404 = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12}>
        <VStack spacing={4}>
          <IconFolder />
          <Heading>We couldn&apos;t find this folder</Heading>
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
