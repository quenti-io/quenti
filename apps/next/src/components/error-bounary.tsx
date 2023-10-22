import Head from "next/head";
import React from "react";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

export const ErrorBoundary: React.FC = () => {
  return (
    <>
      <Head>
        <title>Error | Quenti</title>
      </Head>
      <Center height="calc(100vh - 120px)">
        <VStack textAlign="center" px="4">
          <Heading
            fontSize={{ base: "6xl", md: "8xl", lg: "9xl" }}
            bgGradient="linear(to-r, blue.300, purple.300)"
            bgClip="text"
          >
            Oh Snap!
          </Heading>
          <VStack spacing={6}>
            <Text
              fontSize={{ base: "md", sm: "lg" }}
              color="gray.500"
              fontWeight={600}
            >
              An error occured on this page that we couldn&apos;t handle.
            </Text>
            <Button onClick={() => window.location.reload()}>Reload?</Button>
          </VStack>
        </VStack>
      </Center>
    </>
  );
};
