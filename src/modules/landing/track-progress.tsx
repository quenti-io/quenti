import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Flare } from "../../components/landing/flare";

import studyProgressSrc from "public/assets/landing/study-progress.png";

export const TrackProgress = () => {
  return (
    <Flex as="section" justify="center" pos="relative" mb="32">
      <Flare
        color="orange"
        pos="absolute"
        right="-200px"
        top="100px"
        data-aos="fade"
        data-aos-delay="500"
      />
      <Stack
        style={{ maxWidth: "1000px" }}
        pt={32}
        w="full"
        px="4"
        zIndex={10}
        spacing={12}
        direction={["column", "row"]}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing="6" maxW="300px" minW={[0, "300px"]}>
          <Heading as="h1" data-aos="fade" color="whiteAlpha.900">
            Keep Track of Progress
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: "lg", xl: "xl" }}
            data-aos="fade"
          >
            Pick up from where you last left off on any device. All progress is
            synced to your account.
          </Text>
        </Stack>
        <Box rounded="2xl" data-aos="fade" overflow="hidden">
          <Image
            src={studyProgressSrc}
            alt="incomplete results illustration"
            placeholder="blur"
          />
        </Box>
      </Stack>
    </Flex>
  );
};
