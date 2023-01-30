import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";

export const Hero: NextPage = () => {
  return (
    <>
      <Stack w="full" overflowX="hidden" bgColor="gray.900">
        <Box as="section" overflow="hidden">
          <Stack mx="auto" py="10" pos="relative" pb="32" px={[4, 0]}>
            <VStack mb="20" spacing={20} alignItems="center">
              <VStack pt={["10", "20"]} spacing="6" w="full">
                <Heading
                  as="h1"
                  fontSize={["4xl", "4xl", "5xl", "7xl"]}
                  textAlign="center"
                  maxW="1000px"
                  bgGradient="linear(to-r, blue.300, purple.300)"
                  bgClip="text"
                  data-aos="fade-up"
                >
                  A usable, minimalist Quizlet alternative
                </Heading>
                <Text
                  fontSize={["lg", "xl"]}
                  color="whiteAlpha.900"
                  maxW="800px"
                  textAlign="center"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Tired of Quizlet showing ads and only giving you two practice
                  rounds for free? Turns out an alternative isn&apos;t actually
                  all that hard to make.
                </Text>
                <Stack
                  direction={["column-reverse", "row"]}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Button
                    colorScheme="orange"
                    size="lg"
                    height="4rem"
                    px="2rem"
                  >
                    Sign up for early access
                  </Button>
                </Stack>
              </VStack>
              <Box maxW="1200px" pos="relative">
                <Box
                  pos="absolute"
                  left="-40px"
                  bgColor="orange.500"
                  boxSize={["150px", "150px", "300px", "600px"]}
                  rounded="full"
                  filter="blur(40px)"
                  opacity="0.7"
                  className="animated-blob"
                  data-aos="fade"
                  data-aos-delay="1200"
                />
                <Box
                  pos="absolute"
                  right="-40px"
                  bgColor="blue.500"
                  boxSize={["150px", "150px", "300px", "600px"]}
                  rounded="full"
                  filter="blur(40px)"
                  opacity="0.7"
                  className="animated-blob animation-delay-5000"
                  data-aos="fade"
                  data-aos-delay="1200"
                />
                <Box
                  as="figure"
                  shadow="lg"
                  data-aos="zoom-out-up"
                  data-aos-delay="800"
                ></Box>
              </Box>
            </VStack>
          </Stack>
          <Flex
            justify="center"
            bgGradient="linear(to-b, gray.900, gray.800)"
          ></Flex>
        </Box>
      </Stack>
      <Flex as="section" justify="center">
        <Stack
          style={{ maxWidth: "1200px" }}
          pt={32}
          w="full"
          px="4"
          spacing={16}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={6} w="full">
            <Heading
              fontSize={{ base: "3xl", lg: "5xl", xl: "6xl" }}
              textAlign="center"
              color="whiteAlpha.900"
              data-aos="fade"
            >
              Intelligent Repetition
            </Heading>
            <Text
              textAlign="center"
              fontSize={{ base: "lg", xl: "xl" }}
              color="gray.400"
              data-aos="fade"
            >
              90% of Quizlet&apos;s magic is in the way its &apos;Learn&apos;
              feature works. Terms you&apos;ve studied and know well are gone
              over quickly while unfamiliar terms are matched up more
              frequently. We&apos;ve reverse-engineered this algorithm to offer
              the same learning experience.
            </Text>
            <div />
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};
