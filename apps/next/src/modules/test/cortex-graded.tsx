import { Box, HStack, Text } from "@chakra-ui/react";

import { IconBrain } from "@tabler/icons-react";

export const CortexGraded = () => {
  return (
    <HStack>
      <Text
        fontSize="xs"
        fontWeight={600}
        color="gray.700"
        _dark={{
          color: "gray.300",
        }}
      >
        Graded with
      </Text>
      <HStack
        color="blue.300"
        spacing="4px"
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
          <IconBrain size={16} />
        </Box>
        <Text fontWeight={700} fontSize="sm">
          Cortex
        </Text>
      </HStack>
    </HStack>
  );
};
