import React from "react";

import { Box, Card, HStack, Stack, Text } from "@chakra-ui/react";

interface DeloadedCardProps {
  word: string;
  definition: string;
}

export const DeloadedCardRaw: React.FC<DeloadedCardProps> = ({
  word,
  definition,
}) => {
  return (
    <Card
      rounded="xl"
      borderWidth="2px"
      bg="white"
      borderColor="gray.50"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
    >
      <Box h="54px" />
      <HStack
        pt="2"
        pb="4"
        px="5"
        w="full"
        spacing={6}
        alignItems="start"
        flexDir={{
          base: "column",
          sm: "row",
        }}
        color="transparent"
      >
        <Stack w="full">
          <DeloadedDisplayable>{word}</DeloadedDisplayable>
          <Box h="6" />
        </Stack>
        <Stack w="full">
          <DeloadedDisplayable>{definition}</DeloadedDisplayable>
          <Box h="6" />
        </Stack>
      </HStack>
    </Card>
  );
};

export const DeloadedCard = React.memo(DeloadedCardRaw);

export const DeloadedDisplayable: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box borderBottomWidth="1px" borderColor="transparent" py="7px" minH="39px">
      <Text whiteSpace="pre-wrap">{children}</Text>
    </Box>
  );
};
