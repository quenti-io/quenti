import {
  type Active,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Over,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import { GenericLabel } from "@quenti/components";
import { EvaluatedFalse, EvaluatedTrue } from "@quenti/components/test";
import type { MatchData } from "@quenti/interfaces";
import type { StudySetAnswerMode } from "@quenti/prisma/client";

import {
  Box,
  Center,
  Flex,
  GridItem,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconX } from "@tabler/icons-react";

import { ScriptFormatter } from "../../../components/script-formatter";
import { SquareAssetPreview } from "../../../components/terms/square-asset-preview";
import { InteractivePointerSensor } from "../../../lib/dnd-kit-sensors";
import { useTestContext } from "../../../stores/use-test-store";
import { word } from "../../../utils/terms";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

type _Over = Over & { id: string };
type _Active = Active & { id: string };
type DragEnd = DragEndEvent & { over: _Over | null; active: _Active | null };

export const MatchCard: React.FC<CardProps> = ({ i, result }) => {
  if (result) return <ResultsMatchCard i={i} />;
  return <InteractiveMatchCard i={i} />;
};

const InteractiveMatchCard: React.FC<CardProps> = ({ i }) => {
  const { question, data, answer } = useCardSelector<MatchData>(i);

  const answerQuestion = useTestContext((s) => s.answerQuestion);

  const handleDragEnd = ({ over, active }: DragEnd) => {
    if (over) {
      if (!answer.find((a) => a.zone === over.id)) {
        answerQuestion<MatchData>(
          i,
          [
            ...answer.filter((a) => a.term !== active.id),
            {
              zone: over.id,
              term: active.id,
            },
          ],
          data.terms.length == answer.length + 1,
        );
      } else {
        // Swap the two
        const newAnswer = answer;
        const oldIndex = newAnswer.findIndex((a) => a.term === active.id);
        const newIndex = newAnswer.findIndex((a) => a.zone === over.id)!;

        if (oldIndex !== -1) {
          // Swap the two elements in the array
          const oldZone = newAnswer[oldIndex]!.zone;
          newAnswer[oldIndex]!.zone = newAnswer[newIndex]!.zone;
          newAnswer[newIndex]!.zone = oldZone;
        } else {
          // Move the element to the new index
          newAnswer[newIndex]!.term = active.id;
        }
        answerQuestion<MatchData>(
          i,
          Array.from(newAnswer),
          data.terms.length == answer.length,
        );
      }
    } else {
      answerQuestion<MatchData>(
        i,
        answer.filter((a) => a.term !== active.id),
        false,
      );
    }
  };

  const clearZone = (id: string) => {
    answerQuestion<MatchData>(
      i,
      Array.from(answer.filter((a) => a.zone !== id)),
      false,
    );
  };

  const options = data.terms.filter(
    (t) => !answer.find((a) => a.term === t.id),
  );
  const getInZone = (id: string) => answer.find((a) => a.zone === id);

  const sensors = useSensors(
    useSensor(InteractivePointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Stack>
        <Header i={i} />
        <Stack mt="4">
          <HStack spacing="3" flexWrap="wrap">
            {options.map((term) => (
              <Draggable id={term.id} key={term.id}>
                <ExternalWrapper id={term.id}>
                  <Text whiteSpace="pre-wrap" overflowWrap="anywhere">
                    <ScriptFormatter>
                      {word(question.answerMode, term, "answer")}
                    </ScriptFormatter>
                  </Text>
                </ExternalWrapper>
              </Draggable>
            ))}
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" mt="8">
            {data.zones.map((term, i) => (
              <React.Fragment key={i}>
                <GridItem
                  display="flex"
                  alignItems="center"
                  order={{ base: i + 1, md: i }}
                >
                  <Droppable id={term.id} answerMode={question.answerMode}>
                    {!!getInZone(term.id) && (
                      <Draggable id={getInZone(term.id)!.term}>
                        <InternalWrapper
                          id={getInZone(term.id)!.term}
                          onRemove={() => clearZone(term.id)}
                        >
                          <Text whiteSpace="pre-wrap" overflowWrap="anywhere">
                            <ScriptFormatter>
                              {word(
                                question.answerMode,
                                data.terms.find(
                                  (x) => x.id == getInZone(term.id)?.term,
                                )!,
                                "answer",
                              )}
                            </ScriptFormatter>
                          </Text>
                        </InternalWrapper>
                      </Draggable>
                    )}
                  </Droppable>
                </GridItem>
                <GridItem
                  display="flex"
                  alignItems="center"
                  order={{ base: i, md: i + 1 }}
                >
                  <HStack justifyContent="space-between" gap="4" w="full">
                    <Text whiteSpace="pre-wrap" overflowWrap="anywhere">
                      <ScriptFormatter>
                        {word(question.answerMode, term, "prompt")}
                      </ScriptFormatter>
                    </Text>
                    {question.answerMode == "Word" && term.assetUrl && (
                      <SquareAssetPreview
                        src={term.assetUrl}
                        size={56}
                        rounded={8}
                      />
                    )}
                  </HStack>
                </GridItem>
              </React.Fragment>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </DndContext>
  );
};

const ResultsMatchCard: React.FC<CardProps> = ({ i }) => {
  const { question, data, answer, remarks } = useCardSelector<MatchData>(i);

  const evaluateZone = (id: string): boolean => {
    const term = answer.find((a) => a.zone === id);
    if (!term) return false;
    return term.term === id;
  };
  const getAnswer = (id: string) => {
    const termId = answer.find((a) => a.zone === id)?.term;
    if (!termId) return undefined;
    return data.terms.find((t) => t.id === termId);
  };

  const remark = (id: string) =>
    remarks?.find((r) => r.id === id)?.remark ?? "";

  return (
    <Stack spacing="2">
      <Header i={i} />
      <Stack spacing="8" mt="4">
        {data.zones.map((term, i) => (
          <React.Fragment key={i}>
            <Stack key={term.id} spacing="6">
              <Flex w="full" justifyContent="space-between" gap="4">
                <Text
                  whiteSpace="pre-wrap"
                  fontSize={{ base: "md", sm: "lg" }}
                  overflowWrap="anywhere"
                >
                  <ScriptFormatter>
                    {word(question.answerMode, term, "prompt")}
                  </ScriptFormatter>
                </Text>
                {question.answerMode == "Word" && term.assetUrl && (
                  <SquareAssetPreview
                    src={term.assetUrl}
                    size={80}
                    rounded={8}
                  />
                )}
              </Flex>
              <SimpleGrid
                columns={{
                  base: 1,
                  lg: evaluateZone(term.id) || !getAnswer(term.id) ? 1 : 2,
                }}
                gap="4"
              >
                {!evaluateZone(term.id) && (
                  <Stack spacing="2">
                    <GenericLabel evaluation={evaluateZone(term.id)}>
                      {remark(term.id)}
                    </GenericLabel>
                    {!!getAnswer(term.id) && (
                      <EvaluatedFalse>
                        {word(
                          question.answerMode,
                          getAnswer(term.id)!,
                          "answer",
                        )}
                      </EvaluatedFalse>
                    )}
                  </Stack>
                )}
                <Stack>
                  {!evaluateZone(term.id) ? (
                    <GenericLabel>
                      Correct{" "}
                      {question.answerMode == "Definition"
                        ? "definition"
                        : "term"}
                    </GenericLabel>
                  ) : (
                    <GenericLabel evaluation={evaluateZone(term.id)}>
                      {remark(term.id)}
                    </GenericLabel>
                  )}
                  <EvaluatedTrue>
                    {word(question.answerMode, term, "answer")}
                  </EvaluatedTrue>
                </Stack>
              </SimpleGrid>
            </Stack>
            {i < data.zones.length - 1 && (
              <Box
                w="full"
                h="2px"
                bg="gray.200"
                rounded="full"
                _dark={{
                  bg: "gray.700",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

const Header: React.FC<Pick<CardProps, "i">> = ({ i }) => {
  const { question } = useCardSelector<MatchData>(i);

  return (
    <>
      <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
        Matching questions
      </Text>
      <Text fontSize="xl" fontWeight={600}>
        Drag a {question.answerMode == "Definition" ? "definition" : "term"} to
        its {question.answerMode == "Definition" ? "term" : "definition"} below
      </Text>
    </>
  );
};

const Droppable: React.FC<
  React.PropsWithChildren<{ id: string; answerMode: StudySetAnswerMode }>
> = ({ children, id, answerMode }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      w="full"
      minH="14"
      rounded="xl"
      ref={setNodeRef}
      borderWidth="2px"
      transition="all 0.15s ease-in-out"
      borderColor={isOver ? "gray.200" : "gray.100"}
      _dark={{
        borderColor: isOver ? "gray.500" : "gray.600",
      }}
      position="relative"
    >
      <Center
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        color="gray.500"
        fontSize="sm"
      >
        <Text>
          Drag a {answerMode == "Definition" ? "definition" : "term"} here
        </Text>
      </Center>
      {children}
    </Box>
  );
};

const Draggable: React.FC<React.PropsWithChildren & { id: string }> = ({
  children,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : undefined,
    touchAction: "manipulation",
  };

  return (
    <Box
      ref={setNodeRef}
      position="relative"
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </Box>
  );
};

const ExternalWrapper: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  const { isDragging } = useDraggable({
    id,
  });

  return (
    <Box
      borderWidth="2px"
      bg="gray.50"
      borderColor="gray.200"
      transition="all 0.15s ease-in-out"
      shadow={isDragging ? "lg" : "sm"}
      _hover={{
        borderColor: "gray.300",
      }}
      _dark={{
        bg: "gray.700",
        borderColor: "gray.600",
        _hover: {
          borderColor: "gray.500",
        },
      }}
      rounded="xl"
      py="2"
      px="3"
    >
      {children}
    </Box>
  );
};

const InternalWrapper: React.FC<
  React.PropsWithChildren<{ id: string; onRemove: () => void }>
> = ({ children, id, onRemove }) => {
  const { isDragging } = useDraggable({
    id,
  });

  return (
    <Box
      bg="gray.50"
      borderWidth="2px"
      borderColor="gray.300"
      transition="all 0.15s ease-in-out"
      shadow={isDragging ? "lg" : "none"}
      _dark={{
        bg: "gray.700",
        borderColor: "gray.600",
      }}
      rounded="10px"
      w="full"
      h="full"
      py="2"
      px="3"
    >
      <HStack w="full" justifyContent="space-between">
        {children}
        <IconButton
          size="sm"
          icon={<IconX size={18} style={{ pointerEvents: "none" }} />}
          aria-label="Remove"
          variant="ghost"
          colorScheme="gray"
          rounded="full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        />
      </HStack>
    </Box>
  );
};
