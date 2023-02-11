import { Button, Flex, Heading, Link, VStack } from "@chakra-ui/react";

export const EndSection = () => {
  return (
    <VStack
      as="section"
      py={32}
      pos="relative"
      bgGradient="linear(to-b, gray.900, gray.800)"
      height="100vh"
      justifyContent="center"
    >
      <VStack
        spacing="6"
        maxW="2xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <Heading
          fontWeight="extrabold"
          letterSpacing="tight"
          data-aos="fade-up"
          color="whiteAlpha.900"
        >
          Study effectively once again, for free!
        </Heading>
        <Flex data-aos="fade-up" data-aos-delay="300">
          <Button size="lg" colorScheme="orange" height="4rem">
            Sign up for early access
          </Button>
        </Flex>
      </VStack>
    </VStack>
  );
};
