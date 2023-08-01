import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import type { StudySetAnswerMode } from "@quenti/prisma/client";
import { Select } from "chakra-react-select";
import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";
import { api } from "@quenti/trpc";

const options: { label: string; value: StudySetAnswerMode }[] = [
  {
    label: "Term",
    value: "Word",
  },
  {
    label: "Definition",
    value: "Definition",
  },
  {
    label: "Both",
    value: "Both",
  },
];

export const AnswerModeSection = () => {
  const { id } = useSet();

  const answerWith = useContainerContext((s) => s.answerWith);
  const setAnswerWith = useContainerContext((s) => s.setAnswerWith);

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");
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
        <Select
          selectedOptionStyle="check"
          value={options.find((o) => o.value === answerWith)}
          isSearchable={false}
          onChange={(e) => {
            setAnswerWith(e!.value);
            apiAnswerWith.mutate({
              entityId: id,
              answerWith: e!.value,
            });
          }}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              background: baseBg,
              rounded: "lg",
            }),
            inputContainer: () => ({
              width: 100,
              rounded: "lg",
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              paddingX: 2,
              backgroundColor: dropdownBg,
              color: chevronColor,
            }),
          }}
          options={options}
        />
      </Box>
    </Flex>
  );
};
