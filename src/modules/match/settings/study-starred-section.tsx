import { Flex, Stack, Switch, Text } from "@chakra-ui/react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { api } from "../../../utils/api";

export const StudyStarredSection = () => {
  const { id, type } = useSetFolderUnison();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const matchStudyStarred = useExperienceContext((s) => s.matchStudyStarred);
  const setMatchStudyStarred = useExperienceContext(
    (s) => s.setMatchStudyStarred
  );

  const apiSetMatchStudyStarred =
    type == "set"
      ? api.experience.setMatchStudyStarred.useMutation()
      : api.folders.setMatchStudyStarred.useMutation();

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
            genericId: id,
            matchStudyStarred: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
