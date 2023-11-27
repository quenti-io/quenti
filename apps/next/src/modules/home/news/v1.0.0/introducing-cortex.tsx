import { outfit } from "@quenti/lib/chakra-theme";

import {
  Box,
  Center,
  GridItem,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconBrain, IconLayoutGrid, IconPencil } from "@tabler/icons-react";

import { NewsCard } from "../../news-card";

export const IntroducingCortex = () => {
  return (
    <GridItem>
      <NewsCard
        title="Introducing Cortex"
        description="Cortex helps you learn smarter with answer grading and more."
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
            <HStack zIndex={10} spacing="6">
              <Stack spacing="1">
                <HStack>
                  <Box color="gray.500">
                    <IconLayoutGrid size={18} />
                  </Box>
                  <Text
                    fontWeight={700}
                    fontFamily={outfit.style.fontFamily}
                    fontSize="sm"
                  >
                    6 / 7
                  </Text>
                </HStack>
                <HStack>
                  <Box color="gray.500">
                    <IconPencil size={18} />
                  </Box>
                  <Text
                    fontWeight={700}
                    fontFamily={outfit.style.fontFamily}
                    fontSize="sm"
                  >
                    3 / 4
                  </Text>
                </HStack>
              </Stack>
              <HStack
                color="blue.300"
                bgGradient="linear(to-r, blue.700, blue.300)"
                _dark={{
                  bgGradient: "linear(to-r, blue.100, blue.300)",
                }}
                bgClip="text"
              >
                <Box
                  color="blue.700"
                  _dark={{
                    color: "blue.100",
                  }}
                >
                  <IconBrain size={36} />
                </Box>
                <Heading size="md">Cortex</Heading>
              </HStack>
            </HStack>
          </Center>
        }
      />
    </GridItem>
  );
};
