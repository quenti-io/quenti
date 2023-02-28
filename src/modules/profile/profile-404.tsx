import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconQuestionCircle } from "@tabler/icons-react";
import { Link } from "../../components/link";

export const Profile404 = () => {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack spacing={12}>
        <VStack spacing={4}>
          <IconQuestionCircle />
          <Heading>This account doesn&apos;t exist</Heading>
        </VStack>
        <VStack spacing={4}>
          <Text>It might have been deleted.</Text>
          <Button as={Link} href="/home" variant="ghost">
            Home
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};
