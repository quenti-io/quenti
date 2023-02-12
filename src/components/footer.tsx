import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Kbd,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";

export const Footer = () => {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Container
      maxW="100vw"
      as="footer"
      bg={useColorModeValue("white", "gray.800")}
      borderTop="2px"
      borderTopColor={useColorModeValue("gray.200", "gray.750")}
    >
      <Container maxW="7xl" py="10">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Quizlet.cc</Heading>
          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
              color="gray.500"
              display={{ base: "none", md: "block" }}
            >
              <HStack>
                <Text color={textColor}>Command Menu</Text>
                <Text color={textColor}>
                  <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
                </Text>
              </HStack>
            </Button>
            <Button
              variant="outline"
              size="sm"
              color="blue.300"
              leftIcon={<IconCircleFilled size={16} />}
            >
              <Text color={textColor}>All systems normal</Text>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Container>
  );
};
