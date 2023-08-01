import { Button, Flex } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useSetPropertiesStore } from "../../../stores/use-set-properties-store";
import { api } from "@quenti/trpc";

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
    api.container.resetCardsProgress.useMutation(setDirtyProps);

  return (
    <Flex justifyContent="end">
      <Button
        variant="ghost"
        leftIcon={<IconReload />}
        isLoading={apiResetCardsProgress.isLoading}
        onClick={() => {
          apiResetCardsProgress.mutate({
            entityId: id,
            type: type == "set" ? "StudySet" : "Folder",
          });
        }}
      >
        Restart Flashcards
      </Button>
    </Flex>
  );
};
