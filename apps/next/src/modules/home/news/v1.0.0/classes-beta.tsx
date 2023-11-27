import {
  Box,
  Center,
  GridItem,
  HStack,
  Heading,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import { IconSchool } from "@tabler/icons-react";

import { NewsCard } from "../../news-card";

export const ClassesBeta = () => {
  return (
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
            />
            <Box
              position="absolute"
              zIndex={10}
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
                    <Stack spacing="1" position="absolute" top="40px" left="0">
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
  );
};
