import { Box, Center, GridItem, Heading } from "@chakra-ui/react";

import { NewsCard } from "../../news-card";

export const Quenti10 = () => {
  return (
    <GridItem>
      <NewsCard
        title="Quenti 1.0"
        description="Quenti has finally arrived, redesigned and rebuilt from the ground up."
        image={
          <Center overflow="hidden" w="full" h="full" position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="100px"
              h="100px"
              rounded="full"
              bg="blue.200"
              filter="blur(60px)"
            />
            <Box zIndex={10} position="relative">
              <Heading
                size="3xl"
                color="gray.800"
                opacity={0.05}
                _dark={{
                  opacity: 0.25,
                }}
                position="absolute"
                top="3"
                left="-3"
                filter="blur(2px)"
              >
                1.0
              </Heading>
              <Heading
                position="relative"
                size="3xl"
                bgGradient="linear(to-b, blue.300, blue.200)"
                bgClip="text"
                zIndex={12}
              >
                1.0
              </Heading>
            </Box>
          </Center>
        }
      />
    </GridItem>
  );
};
