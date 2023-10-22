import React from "react";

import { getRandom } from "@quenti/lib/array";
import { GRADING_MESSAGES } from "@quenti/lib/constants/remarks";

import {
  Box,
  Center,
  Heading,
  Progress,
  ScaleFade,
  SlideFade,
  Text,
  VStack,
  keyframes,
} from "@chakra-ui/react";

const rotateBlobs = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "25%": {
    transform: "rotate(50deg)",
  },
  "50%": {
    transform: "rotate(180deg)",
  },
  "75%": {
    transform: "rotate(230deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});
const orangeBlob = keyframes({
  "0%": {
    transform: "translate(0px, 0px) scale(1)",
  },
  "25%": {
    transform: "translate(80px, -80px) scale(1.2)",
  },
  "50%": {
    transform: "translate(0px, 0px) scale(1)",
  },
  "75%": {
    transform: "translate(-80px, 80px) scale(1.2)",
  },
  "100%": {
    transform: "translate(0px, 0px) scale(1)",
  },
});
const blueBlob = keyframes({
  "0%": {
    transform: "translate(0px, 0px) scale(1)",
  },
  "25%": {
    transform: "translate(-80px, 80px) scale(1.2)",
  },
  "50%": {
    transform: "translate(0px, 0px) scale(1)",
  },
  "75%": {
    transform: "translate(80px, -80px) scale(1.2)",
  },
  "100%": {
    transform: "translate(0px, 0px) scale(1)",
  },
});

const LoadingViewRaw = () => {
  const [remark] = React.useState(getRandom(GRADING_MESSAGES));

  return (
    <Center position="fixed" top="20" w="100vw" height="calc(100vh - 160px)">
      <Center position="relative" h="300px">
        <ScaleFade
          in
          transition={{
            enter: {
              duration: 2,
            },
          }}
          style={{
            position: "absolute",
            height: "400px",
            zIndex: -1,
            pointerEvents: "none",
          }}
        >
          <Box
            position="absolute"
            animation={`${rotateBlobs} 7s ease infinite`}
            h="400px"
          >
            <Box
              animation={`${orangeBlob} 7s ease infinite`}
              pos="absolute"
              left="-100px"
              bg="orange.100"
              _dark={{
                bg: "orange.400",
              }}
              boxSize="400px"
              rounded="full"
              filter="blur(80px)"
              opacity="0.5"
            />
            <Box
              animation={`${blueBlob} 7s ease infinite`}
              pos="absolute"
              right="-100px"
              bg="blue.200"
              _dark={{
                bg: "blue.400",
              }}
              boxSize="400px"
              rounded="full"
              filter="blur(80px)"
              opacity="0.4"
            />
          </Box>
        </ScaleFade>
        <VStack>
          <SlideFade in>
            <Progress
              w="48"
              rounded="full"
              mb="4"
              value={20}
              h="1"
              isIndeterminate
              bg="gray.50"
              _dark={{
                bg: "gray.900",
              }}
            />
          </SlideFade>
          <SlideFade
            in
            transition={{
              enter: {
                delay: 0.1,
              },
            }}
          >
            <Heading size="xl">Grading your test...</Heading>
          </SlideFade>
          <SlideFade
            in
            transition={{
              enter: {
                delay: 0.3,
              },
            }}
          >
            <Text
              fontWeight={500}
              color="gray.700"
              _dark={{
                color: "gray.300",
              }}
            >
              {remark}
            </Text>
          </SlideFade>
        </VStack>
      </Center>
    </Center>
  );
};

export const LoadingView = React.memo(LoadingViewRaw);
