import { api } from "@quenti/trpc";

import {
  Box,
  Center,
  Grid,
  GridItem,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import {
  IconBrain,
  IconLayersSubtract,
  IconLayoutGrid,
  IconPencil,
  IconPlus,
  IconReport,
  IconSchool,
} from "@tabler/icons-react";

import { NewsCard } from "./news-card";

export const News = () => {
  const { data } = api.recent.get.useQuery();

  if (!data) return null;

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">What&apos;s new</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        <GridItem>
          <NewsCard
            title="Test and Match are here"
            description="Study with unlimited practice tests and race against the clock with Match and leaderboards."
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
                  bg="blue.300"
                  filter="blur(60px)"
                />
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="20px"
                  h="20px"
                  rounded="full"
                  bg="blue.400"
                  filter="blur(18px)"
                />
                <HStack zIndex={10}>
                  <IconReport size={36} />
                  <IconPlus opacity={0.75} />
                  <IconLayersSubtract size={36} />
                </HStack>
              </Center>
            }
          />
        </GridItem>
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
                      <Text fontWeight={700} fontFamily="Outfit" fontSize="sm">
                        6 / 7
                      </Text>
                    </HStack>
                    <HStack>
                      <Box color="gray.500">
                        <IconPencil size={18} />
                      </Box>
                      <Text fontWeight={700} fontFamily="Outfit" fontSize="sm">
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
        <GridItem>
          <NewsCard
            title={
              <HStack>
                <Heading size="md">Classes</Heading>
                <Tag size="sm" colorScheme="red">
                  Beta
                </Tag>
              </HStack>
            }
            description="Teachers can create classes to manage students, study materials and sections."
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
                  bg="blue.300"
                  filter="blur(60px)"
                />{" "}
                <Box
                  position="absolute"
                  left="50%"
                  top="3"
                  transform="translate(-50%, -50%)"
                  w="200px"
                  h="40px"
                >
                  <Box position="relative" w="full" h="full">
                    <Box
                      w="full"
                      h="full"
                      position="absolute"
                      rounded="xl"
                      bgGradient="linear(to-tr, blue.300, purple.300)"
                      clipPath="url(#banner)"
                    />
                    <svg>
                      <defs>
                        <clipPath id="banner">
                          <path d="m0 0v40h19v-10.997c0-4.4336 3.569-8.0026 8.0026-8.0026h21.995c4.4337 0 8.0026 3.569 8.0026 8.0026v10.997h143v-40z" />
                        </clipPath>
                      </defs>
                    </svg>
                    <Box position="absolute" top="25px" left="23px">
                      <Box position="relative">
                        <Center
                          w="30px"
                          height="30px"
                          rounded="5px"
                          bg="white"
                          color="black"
                          shadow="md"
                        >
                          <IconSchool size={18} />
                        </Center>
                        <Stack
                          spacing="1"
                          position="absolute"
                          top="40px"
                          left="0"
                        >
                          <Heading size="sm" w="max">
                            AP Spanish
                          </Heading>
                          <Text
                            fontSize="10px"
                            color="gray.600"
                            _dark={{
                              color: "gray.400",
                            }}
                          >
                            23 students
                          </Text>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Center>
            }
          />
        </GridItem>
      </Grid>
    </Stack>
  );
};
