import React from "react";

import { Modal } from "@quenti/components/modal";
import { ToggleGroup } from "@quenti/components/toggle-group";
import {
  getQuestionTypeIcon,
  getQuestionTypeName,
} from "@quenti/components/utils";
import { TestQuestionType } from "@quenti/interfaces";

import {
  Box,
  Button,
  Flex,
  GridItem,
  HStack,
  IconButton,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconX } from "@tabler/icons-react";

import { SelectAnswerMode } from "../../components/select-answer-mode";
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
  const startRef = React.useRef<HTMLButtonElement>(null);

  const questionCount = useTestContext((s) => s.settings.questionCount);
  const allTerms = useTestContext((s) => s.allTerms.length);
  const starredTerms = useTestContext((s) => s.starredTerms.length);
  const answerMode = useTestContext((s) => s.settings.answerMode);
  const studyStarred = useTestContext((s) => s.settings.studyStarred);
  const setSettings = useTestContext((s) => s.setSettings);
  const enabled = useTestContext((s) => s.settings.questionTypes.length > 0);

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const ButtonWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    if (enabled) return <>{children}</>;
    return (
      <Tooltip label="Select at least one question type">{children}</Tooltip>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInTop"
      initialFocusRef={startRef}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Flex justifyContent="space-between">
            <Modal.Heading size="xl">Set up your test</Modal.Heading>
            <IconButton
              rounded="full"
              aria-label="Close"
              icon={<IconX />}
              variant="ghost"
              colorScheme="gray"
              onClick={onClose}
            />
          </Flex>
          <Stack spacing="8">
            <HStack
              gap={{ base: 4, sm: 8 }}
              flexDir={{ base: "column", sm: "row" }}
              alignItems={{ base: "start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack spacing="0">
                <Text fontWeight={600} fontFamily="heading">
                  Questions
                </Text>
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
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="3">
              {Object.values(TestQuestionType).map((t) => (
                <GridItem key={t}>
                  <QuestionTypeComponent type={t} />
                </GridItem>
              ))}
            </SimpleGrid>
          </Stack>
          <HStack
            mt="4"
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
          <ButtonWrapper>
            <Button
              ref={startRef}
              isDisabled={!enabled}
              onClick={() => {
                onReset();
                onClose();
              }}
            >
              Start test
            </Button>
          </ButtonWrapper>
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

  const checked = questionTypes.includes(type);
  const enable = () => {
    setSettings({
      questionTypes: [...questionTypes, type],
    });
  };
  const disable = () => {
    setSettings({
      questionTypes: questionTypes.filter((t) => t !== type),
    });
  };

  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const defaultBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Button
      w="full"
      variant="outline"
      rounded="xl"
      bg="transparent"
      borderWidth="2px"
      borderColor={checked ? selectedBorder : defaultBorder}
      py="6"
      px="4"
      colorScheme="gray"
      onClick={() => {
        if (checked) disable();
        else enable();
      }}
    >
      <HStack w="full">
        <Box
          transition="color 0.15s ease-in-out"
          color={checked ? selectedBorder : "gray.400"}
          _dark={{
            color: checked ? selectedBorder : "gray.500",
          }}
        >
          <Icon size={20} />
        </Box>
        <Text fontWeight={600}>{getQuestionTypeName(type)}</Text>
      </HStack>
    </Button>
  );
};
