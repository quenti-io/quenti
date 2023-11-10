import React from "react";

import type { Term } from "@quenti/prisma/client";

import { Box, Card, Center, Flex, HStack, Text } from "@chakra-ui/react";

import { IconStar } from "@tabler/icons-react";

interface DeloadedTermProps {
  term: Term;
  creator?: boolean;
}

export const DeloadedTermRaw: React.FC<DeloadedTermProps> = ({
  term,
  creator,
}) => {
  return (
    <Card
      px={{ base: 0, sm: "22px" }}
      py={{ base: 0, sm: 5 }}
      shadow="0 2px 6px -4px rgba(0, 0, 0, 0.1), 0 2px 4px -4px rgba(0, 0, 0, 0.06)"
      borderWidth="1.5px"
      transition="border-color 0.15s ease-in-out"
      borderColor="gray.100"
      rounded="xl"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
    >
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex
          w="full"
          flexDir={["column", "row", "row"]}
          gap={[2, 6, 6]}
          px={{ base: 3, sm: 0 }}
          py={{ base: 3, sm: 0 }}
        >
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            {term.word}
          </Text>
          <Box
            bg="gray.200"
            _dark={{
              bg: "gray.600",
            }}
            h="full"
            rounded="full"
            w="4px"
          />
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            {term.definition}
          </Text>
        </Flex>
        <Box
          h="full"
          px={{ base: 1, sm: 0 }}
          py={{ base: 2, sm: 0 }}
          borderBottomWidth={{ base: 2, sm: 0 }}
          borderBottomColor={{ base: "gray.100", sm: "none" }}
          _dark={{
            borderBottomColor: { base: "gray.700", sm: "none" },
          }}
        >
          <HStack
            spacing={1}
            height="24px"
            justifyContent={{ base: "space-between", sm: "end" }}
            w="full"
            color="blue.600"
            _dark={{
              color: "blue.200",
            }}
          >
            {creator && (
              <Center w="8" h="8">
                <IconStar size={18} />
              </Center>
            )}
            <Center w="8" h="8">
              <IconStar size={18} />
            </Center>
          </HStack>
        </Box>
      </Flex>
    </Card>
  );
};

export const DeloadedTerm = React.memo(DeloadedTermRaw);
