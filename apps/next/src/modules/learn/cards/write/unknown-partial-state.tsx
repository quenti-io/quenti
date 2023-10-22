import { GenericLabel } from "@quenti/components";
import type { Question } from "@quenti/interfaces";
import { useShortcut } from "@quenti/lib/hooks/use-shortcut";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useAuthedSet } from "../../../../hooks/use-set";
import { useContainerContext } from "../../../../stores/use-container-store";
import { useLearnContext } from "../../../../stores/use-learn-store";
import { word } from "../../../../utils/terms";

export interface UnknownPartialStateProps {
  active: Question;
  guess?: string;
}

export const UnknownPartialState: React.FC<UnknownPartialStateProps> = ({
  active,
  guess,
}) => {
  const { id, container } = useAuthedSet();
  const setMultipleAnswerMode = useContainerContext(
    (s) => s.setMultipleAnswerMode,
  );
  const correctFromUnknown = useLearnContext((s) => s.correctFromUnknown);
  const incorrectFromUnknown = useLearnContext((s) => s.incorrectFromUnknown);

  const put = api.studiableTerms.put.useMutation();
  const apiSetMultipleAnswerMode =
    api.container.setMultipleAnswerMode.useMutation();

  const onRequireOne = () => {
    setMultipleAnswerMode("One");
    correctFromUnknown(active.term.id);

    void (async () => {
      await apiSetMultipleAnswerMode.mutateAsync({
        entityId: id,
        multipleAnswerMode: "One",
      });

      await put.mutateAsync({
        id: active.term.id,
        containerId: container.id,
        mode: "Learn",
        correctness: 2,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount,
      });
    })();
  };

  const onRequireAll = () => {
    setMultipleAnswerMode("All");
    incorrectFromUnknown(active.term.id);

    void (async () => {
      await apiSetMultipleAnswerMode.mutateAsync({
        entityId: id,
        multipleAnswerMode: "All",
      });

      await put.mutateAsync({
        id: active.term.id,
        containerId: container.id,
        mode: "Learn",
        correctness: -1,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount + 1,
      });
    })();
  };

  const grayColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Stack spacing={6}>
      <PartialShotcutLayer
        onRequireOne={onRequireOne}
        onRequireAll={onRequireAll}
      />
      <Stack>
        <GenericLabel>Your answer</GenericLabel>
        <Box
          w="full"
          px="5"
          py="4"
          border="2px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          color={grayColor}
          rounded="xl"
        >
          <Text
            whiteSpace="normal"
            color={textColor}
            textAlign="start"
            fontWeight={500}
          >
            {guess}
          </Text>
        </Box>
      </Stack>
      <Stack>
        <GenericLabel>
          {`Original ${
            active.answerMode == "Definition" ? "definition" : "term"
          }
          `}
        </GenericLabel>
        <Text
          whiteSpace="normal"
          color={textColor}
          textAlign="start"
          fontWeight={500}
        >
          {word(active.answerMode, active.term, "answer")}
        </Text>
      </Stack>
      <Divider />
      <Stack>
        <GenericLabel>
          This question seems to have multiple answers. How should we grade
          this?
        </GenericLabel>
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
  const buttonBorder = useColorModeValue("gray.200", "gray.600");
  const defaultBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("black", "white");

  return (
    <Button
      w="full"
      variant="outline"
      px="8"
      py="5"
      h="full"
      rounded="xl"
      borderWidth="2px"
      colorScheme="gray"
      borderColor={buttonBorder}
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
          <Text
            fontSize="11px"
            lineHeight={0}
            color={questionNumText}
            fontFamily="heading"
          >
            {i + 1}
          </Text>
        </Flex>
        <Text
          size="lg"
          color={textColor}
          whiteSpace="normal"
          textAlign="start"
          fontWeight={500}
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
