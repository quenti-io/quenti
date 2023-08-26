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

import type { MatchData } from "@quenti/interfaces";

import {
  Box,
  Center,
  GridItem,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconX } from "@tabler/icons-react";

import { ScriptFormatter } from "../../../components/script-formatter";
import { InteractivePointerSensor } from "../../../lib/dnd-kit-sensors";
import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { useCardSelector } from "../use-card-selector";

type _Over = Over & { id: string };
type _Active = Active & { id: string };
type DragEnd = DragEndEvent & { over: _Over | null; active: _Active | null };

export const MatchCard = ({ i }: { i: number }) => {
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
        <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
          Matching questions
        </Text>
        <Text fontSize="xl" whiteSpace="pre-wrap" fontWeight={600}>
          Drag a {question.answerMode == "Definition" ? "term" : "definition"}{" "}
          to its {question.answerMode == "Definition" ? "definition" : "term"}{" "}
          below
        </Text>
        <Stack mt="4">
          <Box display="inline-block" ml="-6px" mt="-6px">
            {options.map((term) => (
              <Draggable id={term.id} key={term.id} inline>
                <ExternalWrapper>
                  <Text>
                    <ScriptFormatter>
                      {word(question.answerMode, term, "answer")}
                    </ScriptFormatter>
                  </Text>
                </ExternalWrapper>
              </Draggable>
            ))}
          </Box>
          <SimpleGrid columns={2} gap="6" mt="8">
            {data.terms.map((term) => (
              <>
                <GridItem display="flex" alignItems="center">
                  <Droppable id={term.id}>
                    {!!getInZone(term.id) && (
                      <Draggable id={getInZone(term.id)!.term}>
                        <InternalWrapper onRemove={() => clearZone(term.id)}>
                          <Text>
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
                <GridItem display="flex" alignItems="center">
                  <Text>
                    <ScriptFormatter>
                      {word(question.answerMode, term, "prompt")}
                    </ScriptFormatter>
                  </Text>
                </GridItem>
              </>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </DndContext>
  );
};

const Droppable: React.FC<React.PropsWithChildren & { id: string }> = ({
  children,
  id,
}) => {
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
        borderColor: isOver ? "gray.600" : "gray.700",
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
        <Text>Select a term</Text>
      </Center>
      {children}
    </Box>
  );
};

const Draggable: React.FC<
  React.PropsWithChildren & { id: string; inline?: boolean }
> = ({ children, id, inline = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <Box
      ref={setNodeRef}
      position="relative"
      style={style}
      {...listeners}
      {...attributes}
      display={inline ? "inline-block" : undefined}
      flex="1"
    >
      {children}
    </Box>
  );
};

const ExternalWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box
      borderWidth="2px"
      bg="gray.50"
      borderColor="gray.200"
      transition="all 0.15s ease-in-out"
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
      m="6px"
      py="2"
      px="3"
    >
      {children}
    </Box>
  );
};

const InternalWrapper: React.FC<
  React.PropsWithChildren<{ onRemove: () => void }>
> = ({ children, onRemove }) => {
  return (
    <Box
      bg="gray.50"
      borderWidth="2px"
      borderColor="gray.300"
      _dark={{
        bg: "gray.700",
        borderColor: "gray.600",
      }}
      rounded="xl"
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
            console.log("CLICK", e);
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        />
      </HStack>
    </Box>
  );
};
