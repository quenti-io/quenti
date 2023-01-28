import React from "react";
import { Term } from "@prisma/client";
import { Box, Card, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export interface GenericTermCardProps {
  term: Term;
}

export const GenericTermCard: React.FC<GenericTermCardProps> = ({ term }) => {
  return (
    <Card px="4" py="5">
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
          <Text w="full">{term.word}</Text>
          <Box bg={useColorModeValue("black", "white")} h="full" w="3px" />
          <Text w="full">{term.definition}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
