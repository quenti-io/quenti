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
import { api } from "@quenti/trpc";

export const MultipleAnswerModeSection: React.FC = () => {
  const { id } = useSet();
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const multipleAnswerMode = useContainerContext((s) => s.multipleAnswerMode);
  const setMultipleAnswerMode = useContainerContext(
    (s) => s.setMultipleAnswerMode
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
        <ButtonGroup isAttached>
          <Button
            variant={multipleAnswerMode == "One" ? "solid" : "outline"}
            onClick={() => {
              setMultipleAnswerMode("One");
              apiSetMultipleAnswerMode.mutate({
                entityId: id,
                multipleAnswerMode: "One",
              });
            }}
          >
            One answer
          </Button>
          <Button
            variant={multipleAnswerMode == "All" ? "solid" : "outline"}
            onClick={() => {
              setMultipleAnswerMode("All");
              apiSetMultipleAnswerMode.mutate({
                entityId: id,
                multipleAnswerMode: "All",
              });
            }}
          >
            Exact answer
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};
