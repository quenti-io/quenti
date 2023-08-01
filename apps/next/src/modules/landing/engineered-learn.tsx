import { Box, Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Arrow } from "../../components/landing/arrow";

import continuedLearnSrc from "public/assets/landing/continued-learn.png";
import quizletPlusSrc from "public/assets/landing/quizlet-plus.png";

export const EngineeredLearn = () => {
  return (
    <Flex as="section" justify="center" id="heading-features-start">
      <Stack
        style={{ maxWidth: "1200px" }}
        pt={{ base: 16, lg: 32 }}
        w="full"
        px="4"
        spacing={16}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing={16} w="full">
          <Stack spacing={6}>
            <Heading
              fontSize={{ base: "3xl", lg: "5xl", xl: "6xl" }}
              textAlign="center"
              color="whiteAlpha.900"
              data-aos="fade"
            >
              Reverse-Engineered Learn
            </Heading>
            <Text
              textAlign="center"
              fontSize={{ base: "lg", xl: "xl" }}
              color="gray.400"
              data-aos="fade"
            >
              Arguably Quizlet&apos;s most useful feature, Learn, helps you
              memorize a set by answering each term correctly twice. We&apos;ve
              reverse-engineered it to offer the same experience.
            </Text>
          </Stack>
          <Flex
            gap={12}
            justifyContent="end"
            flexDir={{ base: "column", lg: "row" }}
            data-aos="fade"
          >
            <Stack spacing={4} position="relative">
              <Heading data-aos="fade" color="whiteAlpha.900">
                With Quizlet Learn
              </Heading>
              <Text fontSize={{ base: "lg" }} color="gray.400" data-aos="fade">
                Study only a fraction of the set before running out of free
                rounds.
              </Text>
            </Stack>
            <Box maxW="800px" data-aos="fade" data-aos-delay="500">
              <Image
                src={quizletPlusSrc}
                alt="Builder screenshot"
                placeholder="blur"
                style={{ borderRadius: "10px" }}
              />
            </Box>
          </Flex>
          <Center data-aos="fade">
            <Arrow
              boxSize="100px"
              fill="orange.200"
              transform="rotate(180deg)"
            />
          </Center>
          <Flex
            gap={12}
            flexDir={{ base: "column-reverse", lg: "row" }}
            data-aos="fade"
          >
            <Box maxW="800px" data-aos="fade" data-aos-delay="500">
              <Image
                src={continuedLearnSrc}
                alt="Builder screenshot"
                placeholder="blur"
                style={{ borderRadius: "10px" }}
              />
            </Box>
            <Stack spacing={4}>
              <Heading data-aos="fade" color="whiteAlpha.900">
                With Quenti Learn
              </Heading>
              <Text fontSize={{ base: "lg" }} color="gray.400" data-aos="fade">
                Study, review and master the entire set, for free!
              </Text>
            </Stack>
          </Flex>
          <div />
        </Stack>
      </Stack>
    </Flex>
  );
};
