import { Select } from "chakra-react-select";
import { useSession } from "next-auth/react";

import type { LimitedStudySetAnswerMode } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";

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
  const { status } = useSession();
  const { id, entityType } = useSetFolderUnison();

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

            if (status == "authenticated")
              apiCardsAnswerWith.mutate({
                entityId: id,
                cardsAnswerWith: e!.value,
                type: entityType == "set" ? "StudySet" : "Folder",
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
            control: (provided) => ({
              ...provided,
              rounded: "lg",
            }),
            menuList: (provided) => ({
              ...provided,
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
