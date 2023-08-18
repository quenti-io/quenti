import { HeadSeo } from "@quenti/components";

import { Center, Heading, Text, VStack } from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { StaticWrapper } from "../components/static-wrapper";

export default function NotFound() {
  return (
    <StaticWrapper>
      <HeadSeo
        title="404: This page does not exist"
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <Center height="calc(100vh - 120px)">
        <VStack color="whiteAlpha.900">
          <Heading
            fontSize="9xl"
            bgGradient="linear(to-r, blue.300, purple.300)"
            bgClip="text"
          >
            404
          </Heading>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            color="gray.500"
            fontWeight={600}
          >
            We couldn&apos;t find that page on this server.
          </Text>
        </VStack>
      </Center>
    </StaticWrapper>
  );
}

NotFound.PageWrapper = PageWrapper;
