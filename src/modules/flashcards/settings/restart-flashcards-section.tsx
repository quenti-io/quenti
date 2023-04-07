import { Button, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useSetPropertiesStore } from "../../../stores/use-set-properties-store";
import { api } from "../../../utils/api";

export const RestartFlashcardsSection: React.FC<{
  requestClose: () => void;
}> = ({ requestClose }) => {
  const { id, type } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);

  const setDirtyProps = {
    onSuccess: () => {
      requestClose();
      setIsDirty(true);
    },
  };

  const apiResetCardsProgress =
    type == "set"
      ? api.experience.resetCardsProgress.useMutation(setDirtyProps)
      : api.folders.resetCardsProgress.useMutation(setDirtyProps);

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex gap={8}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Restart Flashcards</Text>
        <Text fontSize="sm" color={mutedColor}>
          Reset progress for flashcards
        </Text>
      </Stack>
      <Button
        px="12"
        variant="ghost"
        leftIcon={<IconReload />}
        isLoading={apiResetCardsProgress.isLoading}
        onClick={() => {
          apiResetCardsProgress.mutate({
            genericId: id,
          });
        }}
      >
        Restart Flashcards
      </Button>
    </Flex>
  );
};
