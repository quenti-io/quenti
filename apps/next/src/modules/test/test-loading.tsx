import React from "react";

import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import { TestCardGap } from "./card-gap";

export const TestLoading = () => {
  return (
    <Container maxW="4xl" mt={{ base: 0, md: 10 }}>
      <Stack spacing="0" pb="20" w="full">
        <TestCardGap type="start" title="Placeholder Title" skeleton />
        <Stack spacing="0">
          {Array.from({ length: 5 }).map((_, i) => (
            <React.Fragment key={i}>
              <TestCardGap
                type="question"
                index={i}
                startingIndex={i}
                numQuestions={500}
                count={1}
                skeleton
              />
              <QuestionSkeleton />
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

const SkeletonPromptDisplay: React.FC<{ label: string }> = ({ label }) => {
  const Line: React.FC<{ w?: string }> = ({ w = "full" }) => (
    <Flex alignItems="center" h="30px">
      <Skeleton w={w} h="24px" rounded="full" variant="refined" />
    </Flex>
  );

  return (
    <Stack w="full">
      <Flex alignItems="center" h="21px">
        <Skeleton
          rounded="4px"
          fitContent
          h="14px"
          variant="refined"
          opacity={0.35}
        >
          <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
            {label}
          </Text>
        </Skeleton>
      </Flex>
      <Box minH={{ base: "60px", md: "140px" }}>
        {label == "Definition" ? (
          <Stack spacing="6px">
            <Line />
            <Line w="35%" />
          </Stack>
        ) : (
          <Line w="50%" />
        )}
      </Box>
    </Stack>
  );
};

export const QuestionSkeleton = () => {
  return (
    <Card
      bg="white"
      borderWidth="2px"
      borderColor="gray.100"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
      rounded="2xl"
      position="relative"
    >
      <Stack
        spacing={6}
        px={{ base: 5, sm: 6, md: 8 }}
        py={{ base: 5, sm: 5, md: 7 }}
      >
        <Grid
          templateColumns={{ base: "1fr", sm: "1fr 2px 1fr" }}
          gap={{ base: 1, md: 3 }}
        >
          <Box w="full" pr={{ base: 0, sm: "4" }}>
            <SkeletonPromptDisplay label="Definition" />
          </Box>
          <Box
            display={{ base: "none", sm: "grid" }}
            bg="gray.200"
            _dark={{
              bg: "gray.700",
            }}
          />
          <Box
            w="full"
            h="2px"
            my="4"
            display={{ base: "block", sm: "none" }}
            bg="gray.200"
            _dark={{
              bg: "gray.700",
            }}
          />
          <Box w="full" pl={{ base: 0, sm: 4 }}>
            <SkeletonPromptDisplay label="Term" />
          </Box>
        </Grid>
        <Stack>
          <Box mb="2">
            <Flex h="21px">
              <Skeleton
                rounded="6px"
                fitContent
                h="14px"
                variant="refined"
                opacity="0.35"
              >
                <Text fontSize="sm" fontWeight={500}>
                  Choose an answer
                </Text>
              </Skeleton>
            </Flex>
          </Box>
          <SimpleGrid columns={2} gap={{ base: 4, md: 6 }}>
            <GridItem>
              <Skeleton
                w="full"
                h="55.2px"
                rounded="xl"
                variant="refined"
                opacity={0.35}
              />
            </GridItem>
            <GridItem>
              <Skeleton
                w="full"
                h="55.2px"
                rounded="xl"
                variant="refined"
                opacity={0.35}
              />
            </GridItem>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
};
