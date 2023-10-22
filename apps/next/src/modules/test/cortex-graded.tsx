import type { CortexGraderResponse } from "@quenti/interfaces";

import { Box, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";

import { IconBrain } from "@tabler/icons-react";

interface CortextGradedProps {
  response: CortexGraderResponse;
}

export const CortexGraded: React.FC<CortextGradedProps> = ({ response }) => {
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
      <Tooltip
        bg="white"
        _dark={{
          bg: "gray.900",
        }}
        py="2"
        px="3"
        label={
          <Stack spacing="2px">
            <Stack spacing="0">
              <Text fontWeight={700}>Similarity</Text>
              <Text fontSize="xs" fontFamily="mono">
                {response.similarity}
              </Text>
            </Stack>
            {response.entailment && (
              <Stack spacing="0">
                <Text fontWeight={700}>Entailment</Text>
                <Text fontSize="xs" fontFamily="mono">
                  {response.entailment.label}: {response.entailment.score}
                </Text>
              </Stack>
            )}
          </Stack>
        }
        placement="top"
      >
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
          <HStack spacing="1">
            <Text fontWeight={700} fontSize="sm">
              Cortex
            </Text>
          </HStack>
        </HStack>
      </Tooltip>
    </HStack>
  );
};
