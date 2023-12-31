import { api } from "@quenti/trpc";

import { Button, Flex } from "@chakra-ui/react";

import { IconReload } from "@tabler/icons-react";

import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useSetPropertiesStore } from "../../../stores/use-set-properties-store";

export const RestartFlashcardsSection: React.FC<{
  requestClose: () => void;
}> = ({ requestClose }) => {
  const { id, entityType } = useSetFolderUnison();
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
        leftIcon={<IconReload size={18} />}
        isLoading={apiResetCardsProgress.isLoading}
        onClick={() => {
          apiResetCardsProgress.mutate({
            entityId: id,
            type: entityType == "set" ? "StudySet" : "Folder",
          });
        }}
      >
        Restart flashcards
      </Button>
    </Flex>
  );
};
