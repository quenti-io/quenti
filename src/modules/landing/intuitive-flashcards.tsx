import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Flare } from "../../components/landing/flare";

import intuitiveFlashcardsSrc from "public/assets/landing/intuitive-flashcards.png";

export const IntuitiveFlashcards = () => {
  return (
    <Flex as="section" justify="center" pos="relative">
      <Flare
        color="blue"
        pos="absolute"
        left="-200px"
        top="-50px"
        data-aos="fade"
        data-aos-delay="500"
      />
      <Stack
        style={{ maxWidth: "1000px" }}
        pt={"52"}
        w="full"
        px="4"
        spacing={12}
        zIndex={10}
        direction={["column", "row-reverse"]}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing="6" maxW="300px" minW={[0, "300px"]}>
          <Heading as="h1" data-aos="fade" color="whiteAlpha.900">
            Intuitive Flashcards
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: "lg", xl: "xl" }}
            data-aos="fade"
          >
            Flashcards are automatically generated for every single set, making
            it super easy to study. They&apos;re free of ads too!
          </Text>
        </Stack>
        <Box rounded="2xl" data-aos="fade" overflow="hidden">
          <Image
            src={intuitiveFlashcardsSrc}
            alt="incomplete results illustration"
            placeholder="blur"
          />
        </Box>
      </Stack>
    </Flex>
  );
};
