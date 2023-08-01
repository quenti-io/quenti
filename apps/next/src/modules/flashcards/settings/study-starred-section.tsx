import { Flex, Stack, Switch, Text } from "@chakra-ui/react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";
import { api } from "@quenti/trpc";

export const StudyStarredSection = () => {
  const { id, type } = useSetFolderUnison();

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const cardsStudyStarred = useContainerContext((s) => s.cardsStudyStarred);
  const setCardsStudyStarred = useContainerContext(
    (s) => s.setCardsStudyStarred
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
            type: type == "set" ? "StudySet" : "Folder",
            cardsStudyStarred: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
