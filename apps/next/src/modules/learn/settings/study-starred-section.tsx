import { ToggleGroup } from "@quenti/components/toggle-group";
import { api } from "@quenti/trpc";

import { Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";

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
      <ToggleGroup
        index={studyStarred ? 1 : 0}
        tabProps={{
          transition: "all 0.2s ease-in-out",
          fontWeight: 600,
        }}
        h="full"
        w="max"
      >
        <ToggleGroup.Tab
          color={!studyStarred ? "blue.300" : undefined}
          onClick={() => {
            setStudyStarred(false);
            apiStudyStarred.mutate({
              entityId: id,
              studyStarred: false,
            });
          }}
          isDisabled={!starredTerms.length}
        >
          All
        </ToggleGroup.Tab>
        <ToggleGroup.Tab
          color={studyStarred ? "blue.300" : undefined}
          onClick={() => {
            setStudyStarred(true);
            apiStudyStarred.mutate({
              entityId: id,
              studyStarred: true,
            });
          }}
          isDisabled={!starredTerms.length}
        >
          Starred
        </ToggleGroup.Tab>
      </ToggleGroup>
    </Flex>
  );
};
