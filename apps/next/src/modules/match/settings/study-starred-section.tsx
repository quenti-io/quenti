import { Flex, Stack, Switch, Text } from "@chakra-ui/react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";
import { api } from "../../../utils/api";

export const StudyStarredSection = () => {
  const { id, type } = useSetFolderUnison();

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const matchStudyStarred = useContainerContext((s) => s.matchStudyStarred);
  const setMatchStudyStarred = useContainerContext(
    (s) => s.setMatchStudyStarred
  );

  const apiSetMatchStudyStarred =
    api.container.setMatchStudyStarred.useMutation();

  return (
    <Flex gap={8}>
      <Stack w="full">
        <Text fontWeight={700}>Study starred</Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={matchStudyStarred}
        isDisabled={starredTerms.length == 0}
        onChange={(e) => {
          setMatchStudyStarred(e.target.checked);
          apiSetMatchStudyStarred.mutate({
            entityId: id,
            type: type == "set" ? "StudySet" : "Folder",
            matchStudyStarred: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
