import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useSet } from "../../../../hooks/use-set";
import { useShortcut } from "../../../../hooks/use-shortcut";
import type { Question } from "../../../../interfaces/question";
import { useExperienceContext } from "../../../../stores/use-experience-store";
import { useLearnContext, word } from "../../../../stores/use-learn-store";
import { api } from "../../../../utils/api";

export interface UnknownPartialStateProps {
  active: Question;
  guess?: string;
}

export const UnknownPartialState: React.FC<UnknownPartialStateProps> = ({
  active,
  guess,
}) => {
  const { id, experience } = useSet();
  const setMutlipleAnswerMode = useExperienceContext(
    (s) => s.setMultipleAnswerMode
  );
  const correctFromUnknown = useLearnContext((s) => s.correctFromUnknown);
  const incorrectFromUnknown = useLearnContext((s) => s.incorrectFromUnknown);

  const put = api.studiableTerms.put.useMutation();
  const apiSetMultipleAnswerMode =
    api.experience.setMutlipleAnswerMode.useMutation();

  const onRequireOne = () => {
    setMutlipleAnswerMode("One");
    correctFromUnknown(active.term.id);

    void (async () => {
      await apiSetMultipleAnswerMode.mutateAsync({
        studySetId: id,
        multipleAnswerMode: "One",
      });

      await put.mutateAsync({
        id: active.term.id,
        experienceId: experience.id,
        correctness: 2,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount,
      });
    })();
  };

  const onRequireAll = () => {
    setMutlipleAnswerMode("All");
    incorrectFromUnknown(active.term.id);

    void (async () => {
      await apiSetMultipleAnswerMode.mutateAsync({
        studySetId: id,
        multipleAnswerMode: "All",
      });

      await put.mutateAsync({
        id: active.term.id,
        experienceId: experience.id,
        correctness: -1,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount + 1,
      });
    })();
  };

  const grayColor = useColorModeValue("gray.600", "gray.400");
  const grayText = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Stack spacing={6}>
      <PartialShotcutLayer
        onRequireOne={onRequireOne}
        onRequireAll={onRequireAll}
      />
      <Stack spacing={4}>
        <Text fontWeight={600} color={grayText}>
          Your answer
        </Text>
        <Box
          w="full"
          px="4"
          py="4"
          border="2px"
          bg={useColorModeValue("gray.200", "gray.600")}
          borderColor={useColorModeValue("gray.300", "gray.500")}
          color={grayColor}
          rounded="lg"
        >
          <Text
            whiteSpace="normal"
            color={textColor}
            textAlign="start"
            fontWeight="normal"
          >
            {guess}
          </Text>
        </Box>
      </Stack>
      <Stack spacing={4}>
        <Text fontWeight={600} color={grayText}>
          {`Original ${
            active.answerMode == "Definition" ? "definition" : "term"
          }
          `}
        </Text>
        <Text
          whiteSpace="normal"
          color={textColor}
          textAlign="start"
          fontWeight="normal"
        >
          {word(active.answerMode, active.term, "answer")}
        </Text>
      </Stack>
      <Divider />
      <Stack spacing={6}>
        <Text fontWeight={600} color={textColor}>
          This question seems to have multiple answers. How should we grade
          this?
        </Text>
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
          <GridItem>
            <ChoiceOption
              i={0}
              text="Require one answer"
              onSelect={onRequireOne}
            />
          </GridItem>
          <GridItem>
            <ChoiceOption
              i={1}
              text="Require all answers"
              onSelect={onRequireAll}
            />
          </GridItem>
        </Grid>
      </Stack>
    </Stack>
  );
};

interface ChoiceOptionProps {
  i: number;
  text: string;
  onSelect: () => void;
  disabled?: boolean;
}

const ChoiceOption: React.FC<ChoiceOptionProps> = ({
  i,
  text,
  onSelect,
  disabled = false,
}) => {
  const questionNumText = useColorModeValue("gray.800", "gray.200");
  const defaultBorder = useColorModeValue("blue.600", "blue.200");
  const textColor = useColorModeValue("black", "white");

  return (
    <Button
      w="full"
      variant="outline"
      bg="transparent"
      border="2px"
      px="8"
      py="5"
      h="full"
      isDisabled={disabled}
      onClick={onSelect}
    >
      <Flex alignItems="center" w="full" gap={4}>
        <Flex
          border="solid 2px"
          borderColor={defaultBorder}
          rounded="full"
          w="6"
          h="6"
          minW="6"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" lineHeight={0} color={questionNumText}>
            {i + 1}
          </Text>
        </Flex>
        <Text
          size="lg"
          color={textColor}
          whiteSpace="normal"
          textAlign="start"
          fontWeight="normal"
        >
          {text}
        </Text>
      </Flex>
    </Button>
  );
};

interface PartialShotcutLayerProps {
  onRequireOne: () => void;
  onRequireAll: () => void;
}

const PartialShotcutLayer: React.FC<PartialShotcutLayerProps> = ({
  onRequireOne,
  onRequireAll,
}) => {
  useShortcut(["1"], onRequireOne, {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["2"], () => onRequireAll, {
    ctrlKey: false,
    allowInput: true,
  });

  return <></>;
};
