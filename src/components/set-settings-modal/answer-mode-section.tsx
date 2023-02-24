import { Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import type { StudySetAnswerMode } from "@prisma/client";
import { Select } from "chakra-react-select";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

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

  const answerWith = useExperienceContext((s) => s.answerWith);
  const setAnswerWith = useExperienceContext((s) => s.setAnswerWith);

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiAnswerWith = api.experience.setAnswerMode.useMutation();

  return (
    <Flex gap={8}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Answer with</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how to answer when studying
        </Text>
      </Stack>
      <Select
        selectedOptionStyle="check"
        value={options.find((o) => o.value === answerWith)}
        onChange={(e) => {
          setAnswerWith(e!.value);
          apiAnswerWith.mutate({
            studySetId: id,
            answerWith: e!.value,
          });
        }}
        chakraStyles={{
          inputContainer: () => ({
            width: 100,
          }),
          valueContainer: (provided) => ({
            ...provided,
            backgroundColor: baseBg,
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
    </Flex>
  );
};
