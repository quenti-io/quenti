import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import type { LimitedStudySetAnswerMode } from "@prisma/client";
import { Select } from "chakra-react-select";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";
import { api } from "../../../utils/api";

const options: { label: string; value: LimitedStudySetAnswerMode }[] = [
  {
    label: "Term",
    value: "Word",
  },
  {
    label: "Definition",
    value: "Definition",
  },
];

export const CardsAnswerModeSection = () => {
  const { id, type } = useSetFolderUnison();

  const cardsAnswerWith = useContainerContext((s) => s.cardsAnswerWith);
  const setCardsAnswerWith = useContainerContext((s) => s.setCardsAnswerWith);

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiCardsAnswerWith = api.container.setCardsAnswerWith.useMutation();

  return (
    <Flex gap={{ base: 4, sm: 8 }} flexDir={{ base: "column", sm: "row" }}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Answer with</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how to answer with flashcards
        </Text>
      </Stack>
      <Box w="60">
        <Select
          selectedOptionStyle="check"
          value={options.find((o) => o.value === cardsAnswerWith)}
          isSearchable={false}
          onChange={(e) => {
            setCardsAnswerWith(e!.value);
            apiCardsAnswerWith.mutate({
              entityId: id,
              cardsAnswerWith: e!.value,
              type: type == "set" ? "StudySet" : "Folder",
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
      </Box>
    </Flex>
  );
};
