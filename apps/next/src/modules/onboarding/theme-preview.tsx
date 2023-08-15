import React from "react";

import { Box, Flex, HStack, Stack } from "@chakra-ui/react";

import { Logo } from "../../../../../packages/components/logo";

export interface ThemePreviewProps {
  variant: "light" | "dark";
  selected?: boolean;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  variant,
  selected,
}) => {
  const light = variant == "light";

  const bg = light ? "gray.100" : "gray.1000";
  const card = light ? "white" : "gray.700";
  const mutedCard = light ? "gray.50" : "gray.750";

  return (
    <Box
      w="48"
      h="108px"
      bg={bg}
      rounded="md"
      p="2"
      overflow="hidden"
      shadow="sm"
      outline="2px solid"
      transition="outline-color 1s ease-in-out"
      outlineColor={selected ? "blue.300" : "transparent"}
    >
      <Stack>
        <HStack>
          <Logo w="3" h="3" />
          <Box h="1" w="4" bg={mutedCard} rounded="sm" />
          <Box h="2" w="4" bg="blue.400" rounded="sm" shadow="sm" />
        </HStack>
        <Stack spacing="6px">
          <Stack spacing="2px">
            <Box h="9px" w="full" bg={mutedCard} rounded="2px" />
            <HStack spacing="2px">
              <Box w="6px" h="6px" rounded="full" bg={mutedCard} />
              <Box h="4px" w="30px" rounded="2px" bg={mutedCard} />
            </HStack>
          </Stack>
          <Flex w="full" justifyContent="stretch" gap="1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box h="3" w="full" bg={card} shadow="sm" key={i} rounded="2px" />
            ))}
          </Flex>
          <Box
            w="full"
            h="53px"
            bg={card}
            mt="2px"
            rounded="4px"
            shadow="sm"
            position="relative"
            overflow="hidden"
          >
            <Box h="1px" w="33%" bg="orange.300" top="0" left="0" />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
