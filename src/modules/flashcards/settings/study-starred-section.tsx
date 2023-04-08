import { Flex, Stack, Switch, Text } from "@chakra-ui/react";
import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { api } from "../../../utils/api";

export const StudyStarredSection = () => {
  const { id, type } = useSetFolderUnison();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const cardsStudyStarred = useExperienceContext((s) => s.cardsStudyStarred);
  const setCardsStudyStarred = useExperienceContext(
    (s) => s.setCardsStudyStarred
  );

  const apiSetCardsStudyStarred =
    type == "set"
      ? api.experience.setCardsStudyStarred.useMutation()
      : api.folders.setCardsStudyStarred.useMutation();

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
            genericId: id,
            cardsStudyStarred: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
