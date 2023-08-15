import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";

export const StudyStarredSection = () => {
  const { id } = useSet();

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const studyStarred = useContainerContext((s) => s.studyStarred);
  const setStudyStarred = useContainerContext((s) => s.setStudyStarred);

  const apiStudyStarred = api.container.setStudyStarred.useMutation();

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
              entityId: id,
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
              entityId: id,
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
