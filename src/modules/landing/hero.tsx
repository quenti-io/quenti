import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { MainButton } from "./main-button";

import { IconChevronDown } from "@tabler/icons-react";
import setScreenshotSrc from "public/assets/landing/set-screenshot.png";

export const Hero = () => {
  return (
    <Stack w="full" overflowX="hidden" bgColor="gray.900">
      <Box as="section" overflow="hidden">
        <Stack mx="auto" py="10" pos="relative" pb="0" px="4">
          <VStack spacing={20} alignItems="center">
            <VStack pt={["10", "20"]} spacing="8" w="full" zIndex={20}>
              <VStack spacing="6">
                <Heading
                  as="h1"
                  fontSize={["4xl", "4xl", "5xl", "7xl"]}
                  textAlign="center"
                  maxW="1000px"
                  bgGradient="linear(to-r, blue.300, purple.300)"
                  bgClip="text"
                  data-aos="fade-up"
                >
                  A batteries included Quizlet alternative
                </Heading>
                <Text
                  fontSize={["lg", "xl"]}
                  color="whiteAlpha.900"
                  maxW="800px"
                  textAlign="center"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Tired of Quizlet showing ads and only giving you a few
                  practice rounds for free? Stop wasting your time getting
                  bombarded by premium offers, and resume studying today.
                </Text>
              </VStack>
              <Stack
                direction={{ base: "column", sm: "row" }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <MainButton />
                <Button
                  variant="ghost"
                  size="lg"
                  height="4rem"
                  px="2rem"
                  rightIcon={<IconChevronDown />}
                  onClick={() => {
                    document
                      .getElementById("heading-features-start")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  Learn More
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
                pos="relative"
              >
                <Image
                  src={setScreenshotSrc}
                  alt="Builder screenshot"
                  placeholder="blur"
                  style={{ borderRadius: "10px" }}
                />
              </Box>
            </Box>
          </VStack>
        </Stack>
        <Flex
          justify="center"
          bgGradient="linear(to-b, gray.900, gray.800)"
          h={{ base: 10, lg: 200 }}
        />
      </Box>
    </Stack>
  );
};
