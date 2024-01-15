import React from "react";

import type { Term } from "@quenti/prisma/client";

import { Box, Card, Flex, Text, useColorModeValue } from "@chakra-ui/react";

import { ScriptFormatter } from "./script-formatter";

export interface GenericTermCardProps {
  term: Omit<Term, "ephemeral" | "authorId" | "submissionId" | "topicId">;
  variantBg?: boolean;
}

export const GenericTermCard: React.FC<GenericTermCardProps> = ({
  term,
  variantBg,
}) => {
  const setBg = useColorModeValue("gray.100", "gray.750");

  return (
    <Card
      px="4"
      py="5"
      bg={variantBg ? setBg : undefined}
      rounded="xl"
      borderWidth="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
    >
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            <ScriptFormatter>{term.word}</ScriptFormatter>
          </Text>
          <Box
            bg={useColorModeValue("gray.200", "gray.600")}
            h="full"
            rounded="full"
            w="4px"
          />
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            <ScriptFormatter>{term.definition}</ScriptFormatter>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
