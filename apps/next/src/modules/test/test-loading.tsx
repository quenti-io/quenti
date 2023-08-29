import React from "react";

import { Container, Skeleton, Stack } from "@chakra-ui/react";

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
              <Skeleton
                key={i}
                rounded="2xl"
                w="full"
                h={{ base: "376px", sm: "245px", md: "340px" }}
              />
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};
