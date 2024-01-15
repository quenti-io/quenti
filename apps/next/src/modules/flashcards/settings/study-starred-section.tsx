import { api } from "@quenti/trpc";

import { Flex, Stack, Switch, Text } from "@chakra-ui/react";

import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";

export const StudyStarredSection = () => {
  const { id, entityType } = useSetFolderUnison();

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const cardsStudyStarred = useContainerContext((s) => s.cardsStudyStarred);
  const setCardsStudyStarred = useContainerContext(
    (s) => s.setCardsStudyStarred,
  );

  const apiSetCardsStudyStarred =
    api.container.setCardsStudyStarred.useMutation();

  return (
    <Flex gap={8}>
      <Stack w="full">
        <Text fontWeight={700}>Study starred</Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={cardsStudyStarred}
        isDisabled={starredTerms.length == 0}
        onChange={(e) => {
          setCardsStudyStarred(e.target.checked);
          apiSetCardsStudyStarred.mutate({
            entityId: id,
            type: entityType == "set" ? "StudySet" : "Folder",
            cardsStudyStarred: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
