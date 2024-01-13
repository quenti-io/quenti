import {
  Box,
  Card,
  Center,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IconUsersGroup } from "@tabler/icons-react";

import { GhostGroup } from "../../../../components/ghost-group";
import { SkeletonLabel } from "../../../../components/skeleton-label";
import { useProtectedRedirect } from "../../use-protected-redirect";

export const TypeSection = () => {
  const isLoaded = useProtectedRedirect();

  return (
    <Stack spacing="2">
      <SkeletonLabel isLoaded={isLoaded}>Assignment type</SkeletonLabel>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
        <GridItem>
          <Skeleton rounded="lg" isLoaded={isLoaded} w="full">
            <Card
              p="6"
              py="5"
              shadow="lg"
              rounded="lg"
              bg="white"
              _hover={{
                transform: "translateY(-4px)",
                bg: "gray.50",
              }}
              _dark={{
                bg: "gray.750",
                _hover: {
                  bg: "gray.700",
                },
              }}
              outline="2px solid"
              outlineColor="rgba(75, 131, 255, 0.75)"
              transition="all ease-in-out 150ms"
              cursor="pointer"
            >
              <Stack>
                <HStack>
                  <IconUsersGroup size={20} />
                  <Heading size="md">Collab</Heading>
                </HStack>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Students collaborate to build a study set by contributing a
                  few flashcards each. Optionally specify topics to assign to
                  students.
                </Text>
              </Stack>
            </Card>
          </Skeleton>
        </GridItem>
        <GridItem>
          <Skeleton rounded="lg" isLoaded={isLoaded} h="full" w="full">
            <Center
              borderWidth="2px"
              borderColor="gray.200"
              _dark={{
                borderColor: "gray.750",
              }}
              color="gray.500"
              rounded="lg"
              h="full"
              p="12"
              py="7"
              textAlign="center"
              overflow="hidden"
            >
              <VStack>
                <Box transform="scale(0.6)" mt="-8">
                  <GhostGroup />
                </Box>
                <Box position="relative" mt="-6">
                  <Box
                    position="absolute"
                    bg="gray.50"
                    _dark={{
                      bg: "gray.900",
                    }}
                    top="0"
                    left="0"
                    w="full"
                    h="full"
                    filter="blur(10px)"
                  />
                  <Text
                    fontSize="sm"
                    position="relative"
                    color="gray.600"
                    _dark={{
                      color: "gray.400",
                    }}
                    fontWeight={600}
                    lineHeight={1.3}
                  >
                    More assignment types coming soon
                  </Text>
                </Box>
              </VStack>
            </Center>
          </Skeleton>
        </GridItem>
      </SimpleGrid>
    </Stack>
  );
};
