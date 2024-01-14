import { ToggleGroup } from "@quenti/components/toggle-group";
import { api } from "@quenti/trpc";

import { Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";

export const MultipleAnswerModeSection: React.FC = () => {
  const { id } = useSet();
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const multipleAnswerMode = useContainerContext((s) => s.multipleAnswerMode);
  const setMultipleAnswerMode = useContainerContext(
    (s) => s.setMultipleAnswerMode,
  );

  const apiSetMultipleAnswerMode =
    api.container.setMultipleAnswerMode.useMutation();

  return (
    <Flex gap={4} direction="column">
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Grading</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how written questions with multiple answers are graded
        </Text>
      </Stack>
      <Flex justifyContent={{ base: "start", sm: "end" }}>
        <ToggleGroup
          index={multipleAnswerMode == "One" ? 0 : 1}
          tabProps={{
            fontWeight: 600,
          }}
        >
          <ToggleGroup.Tab
            onClick={() => {
              setMultipleAnswerMode("One");
              apiSetMultipleAnswerMode.mutate({
                entityId: id,
                multipleAnswerMode: "One",
              });
            }}
          >
            One answer
          </ToggleGroup.Tab>
          <ToggleGroup.Tab
            onClick={() => {
              setMultipleAnswerMode("All");
              apiSetMultipleAnswerMode.mutate({
                entityId: id,
                multipleAnswerMode: "All",
              });
            }}
          >
            Exact answer
          </ToggleGroup.Tab>
        </ToggleGroup>
      </Flex>
    </Flex>
  );
};
