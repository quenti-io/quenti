import { api } from "@quenti/trpc";

import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { SelectAnswerMode } from "../../../components/select-answer-mode";
import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";

export const AnswerModeSection = () => {
  const { id } = useSet();

  const answerWith = useContainerContext((s) => s.answerWith);
  const setAnswerWith = useContainerContext((s) => s.setAnswerWith);

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiAnswerWith = api.container.setAnswerMode.useMutation();

  return (
    <Flex gap={{ base: 4, sm: 8 }} flexDir={{ base: "column", sm: "row" }}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Answer with</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how to answer when studying
        </Text>
      </Stack>
      <Box w="60">
        <SelectAnswerMode
          value={answerWith}
          onChange={(v) => {
            setAnswerWith(v);
            apiAnswerWith.mutate({
              entityId: id,
              answerWith: v,
            });
          }}
        />
      </Box>
    </Flex>
  );
};
