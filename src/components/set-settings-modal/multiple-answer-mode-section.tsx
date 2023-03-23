import {
  Button,
  ButtonGroup,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

export const MultipleAnswerModeSection: React.FC = () => {
  const { id } = useSet();
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const multipleAnswerMode = useExperienceContext((s) => s.multipleAnswerMode);
  const setMultipleAnswerMode = useExperienceContext(
    (s) => s.setMultipleAnswerMode
  );

  const apiSetMultipleAnswerMode =
    api.experience.setMutlipleAnswerMode.useMutation();

  return (
    <Flex gap={8} direction="column">
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Grading</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how written questions with multiple answers are graded
        </Text>
      </Stack>
      <Flex justifyContent="end">
        <ButtonGroup isAttached>
          <Button
            variant={multipleAnswerMode == "One" ? "solid" : "outline"}
            onClick={() => {
              setMultipleAnswerMode("One");
              apiSetMultipleAnswerMode.mutate({
                studySetId: id,
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
                studySetId: id,
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
