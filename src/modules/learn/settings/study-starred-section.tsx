import {
  Button,
  ButtonGroup,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSet } from "../../../hooks/use-set";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { api } from "../../../utils/api";

export const StudyStarredSection = () => {
  const { id } = useSet();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const studyStarred = useExperienceContext((s) => s.studyStarred);
  const setStudyStarred = useExperienceContext((s) => s.setStudyStarred);

  const apiStudyStarred = api.experience.setStudyStarred.useMutation();

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex gap={{ base: 4, sm: 8 }} flexDir={{ base: "column", sm: "row" }}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Terms</Text>
        <Text fontSize="sm" color={mutedColor}>
          Select which terms to study
        </Text>
      </Stack>
      <ButtonGroup isAttached isDisabled={!starredTerms.length}>
        <Button
          variant={!studyStarred ? "solid" : "outline"}
          onClick={() => {
            setStudyStarred(false);
            apiStudyStarred.mutate({
              studySetId: id,
              studyStarred: false,
            });
          }}
        >
          All
        </Button>
        <Button
          variant={studyStarred ? "solid" : "outline"}
          onClick={() => {
            setStudyStarred(true);
            apiStudyStarred.mutate({
              studySetId: id,
              studyStarred: true,
            });
          }}
        >
          Starred
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
