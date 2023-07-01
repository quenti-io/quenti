import { Flex, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";
import { api } from "../../../utils/api";

export const CardsSortingSection = () => {
  const { id, type } = useSetFolderUnison();

  const [enableCardsSorting, setEnableCardsSorting] = useContainerContext(
    (s) => [s.enableCardsSorting, s.setEnableCardsSorting]
  );

  const apiEnableCardsSorting =
    api.container.setEnableCardsSorting.useMutation();

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex gap={8}>
      <Stack spacing={1} w="full">
        <Text fontWeight={700} fontSize="lg">
          Sort Flashcards
        </Text>
        <Text fontSize="sm" color={mutedColor}>
          Study your flashcards by sorting the ones you know. Leave this off to
          quickly review cards.
        </Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={enableCardsSorting}
        onChange={(e) => {
          setEnableCardsSorting(e.target.checked);
          apiEnableCardsSorting.mutate({
            entityId: id,
            enableCardsSorting: e.target.checked,
            type: type == "set" ? "StudySet" : "Folder",
          });
        }}
      />
    </Flex>
  );
};
