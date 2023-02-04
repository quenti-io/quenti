import React from "react";
import type { Term } from "@prisma/client";
import { Box, Card, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export interface GenericTermCardProps {
  term: Term;
  variantBg?: boolean;
}

export const GenericTermCard: React.FC<GenericTermCardProps> = ({ term, variantBg }) => {
  const setBg = useColorModeValue("gray.100", "gray.750");

  return (
    <Card px="4" py="5" bg={variantBg ? setBg : undefined}>
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
          <Text w="full">{term.word}</Text>
          <Box bg={useColorModeValue("gray.200", "gray.600")} h="full" w="3px" />
          <Text w="full">{term.definition}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
