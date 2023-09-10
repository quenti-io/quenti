import React from "react";

import {
  getQuestionTypeIcon,
  getQuestionTypeName,
} from "@quenti/components/utils";
import { TestQuestionType } from "@quenti/interfaces";

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Modal } from "@quenti/components/modal";
import { SelectAnswerMode } from "../../components/select-answer-mode";
import { ToggleGroup } from "../../components/toggle-group";
import { useTestContext } from "../../stores/use-test-store";

export interface TestSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const TestSettingsModal: React.FC<TestSettingsModalProps> = ({
  isOpen,
  onClose,
  onReset,
}) => {
  const questionCount = useTestContext((s) => s.settings.questionCount);
  const allTerms = useTestContext((s) => s.allTerms.length);
  const starredTerms = useTestContext((s) => s.starredTerms.length);
  const answerMode = useTestContext((s) => s.settings.answerMode);
  const studyStarred = useTestContext((s) => s.settings.studyStarred);
  const setSettings = useTestContext((s) => s.setSettings);

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Settings</Modal.Heading>
          <HStack
            gap={{ base: 4, sm: 8 }}
            flexDir={{ base: "column", sm: "row" }}
            alignItems={{ base: "start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing="0">
              <Text fontWeight={600}>Questions</Text>
            </Stack>
            <Slider
              min={1}
              max={studyStarred ? starredTerms : allTerms}
              step={1}
              value={questionCount}
              onChange={(v) => {
                setSettings({ questionCount: v });
              }}
            >
              <SliderTrack
                bg="gray.100"
                _dark={{
                  bg: "gray.700",
                }}
                h="3px"
                rounded="full"
              >
                <Box position="relative" right={10} />
                <SliderFilledTrack bg="blue.300" />
              </SliderTrack>
              <SliderThumb
                boxSize={12}
                borderWidth="3px"
                bg="white"
                borderColor="blue.300"
                _dark={{
                  bg: "gray.800",
                  borderColor: "blue.300",
                }}
                shadow="md"
                transitionProperty="transform,border-width"
                transitionDuration="normal"
                _active={{
                  transform: `translateY(-50%) scale(1.3)`,
                  borderWidth: "2.3px",
                }}
              >
                <Text
                  color="gray.900"
                  _dark={{
                    color: "white",
                  }}
                  fontSize="sm"
                  fontWeight={700}
                  fontFamily="heading"
                >
                  {questionCount}
                </Text>
              </SliderThumb>
            </Slider>
          </HStack>
          <Modal.Divider />
          <Stack spacing="3">
            {Object.values(TestQuestionType).map((t) => (
              <QuestionTypeComponent key={t} type={t} />
            ))}
          </Stack>
          <Modal.Divider />
          <HStack
            gap={{ base: 4, sm: 8 }}
            flexDir={{ base: "column", sm: "row" }}
            alignItems={{ base: "start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing="0">
              <Text fontWeight={600}>Terms</Text>
              <Text fontSize="sm" color={mutedColor}>
                Choose which terms to study
              </Text>
            </Stack>
            <ToggleGroup
              index={studyStarred ? 1 : 0}
              tabProps={{
                fontWeight: 600,
              }}
            >
              <ToggleGroup.Tab
                onClick={() => {
                  setSettings({ studyStarred: false });
                }}
                isDisabled={!starredTerms}
              >
                All
              </ToggleGroup.Tab>
              <ToggleGroup.Tab
                onClick={() => {
                  setSettings({
                    studyStarred: true,
                    questionCount: Math.min(questionCount, starredTerms),
                  });
                }}
                isDisabled={!starredTerms}
              >
                Starred
              </ToggleGroup.Tab>
            </ToggleGroup>
          </HStack>
          <Modal.Divider />
          <HStack
            gap={{ base: 4, sm: 8 }}
            flexDir={{ base: "column", sm: "row" }}
            alignItems={{ base: "start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing="0">
              <Text fontWeight={600}>Answer with</Text>
              <Text fontSize="sm" color={mutedColor}>
                Choose how to answer questions
              </Text>
            </Stack>
            <Box w="40">
              <SelectAnswerMode
                value={answerMode}
                onChange={(v) => {
                  setSettings({ answerMode: v });
                }}
              />
            </Box>
          </HStack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onReset();
                onClose();
              }}
            >
              Start test
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const QuestionTypeComponent: React.FC<{ type: TestQuestionType }> = ({
  type,
}) => {
  const questionTypes = useTestContext((s) => s.settings.questionTypes);
  const setSettings = useTestContext((s) => s.setSettings);

  const Icon = getQuestionTypeIcon(type);

  return (
    <HStack justifyContent="space-between">
      <HStack>
        <Box
          color="gray.400"
          _dark={{
            color: "gray.500",
          }}
        >
          <Icon size={20} />
        </Box>
        <Text fontWeight={600}>{getQuestionTypeName(type)}</Text>
      </HStack>
      <Switch
        size="md"
        isChecked={questionTypes.includes(type)}
        isDisabled={questionTypes.length <= 1 && questionTypes.includes(type)}
        onChange={(e) => {
          if (e.target.checked) {
            setSettings({
              questionTypes: [...questionTypes, type],
            });
          } else {
            setSettings({
              questionTypes: questionTypes.filter((t) => t !== type),
            });
          }
        }}
      />
    </HStack>
  );
};
