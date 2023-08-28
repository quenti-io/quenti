import React from "react";
import useFitText from "use-fit-text";

import type { Term } from "@quenti/prisma/client";

import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconArrowBackUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconEditCircle,
  IconStar,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";

import { ScriptFormatter } from "./script-formatter";
import { SetCreatorOnly } from "./set-creator-only";

export interface FlashcardProps {
  term: Term;
  isFlipped: boolean;
  index: number;
  numTerms: number;
  starred: boolean;
  h?: string;
  variant?: "default" | "sortable";
  onLeftAction: () => void;
  onRightAction: () => void;
  onBackAction?: () => void;
  onRequestEdit: () => void;
  onRequestStar: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  term,
  isFlipped,
  index,
  numTerms,
  starred,
  h = "500px",
  variant = "default",
  onLeftAction,
  onRightAction,
  onBackAction,
  onRequestEdit,
  onRequestStar,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const Star = starred ? IconStarFilled : IconStar;
  const LeftIcon = variant == "sortable" ? IconX : IconChevronLeft;
  const RightIcon = variant == "sortable" ? IconCheck : IconChevronRight;

  const genericColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const leftColor = useColorModeValue("red.500", "red.200");
  const rightColor = useColorModeValue("green.500", "green.200");
  const buttonBorder = useColorModeValue("gray.300", "gray.500");

  return (
    <Card w="full" h={h} rounded="xl" shadow="xl" overflow="hidden">
      <Box
        bg="orange.300"
        height="1"
        minH="1"
        style={{
          visibility: !isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
      <Flex flexDir="column" h="full" p="8">
        <Grid templateColumns="1fr 1fr 1fr">
          <HStack h="max" alignItems="start">
            {variant == "sortable" && (
              <IconButton
                transform="translateY(-4px)"
                ml="-2"
                icon={<IconArrowBackUp size={24} />}
                aria-label="Back"
                size="sm"
                variant="ghost"
                rounded="full"
                onClick={(e) => {
                  e.stopPropagation();
                  onBackAction?.();
                }}
                isDisabled={index == 0}
              />
            )}
            <Text fontWeight={700} color="gray.500">
              {isFlipped ? "Definition" : "Term"}
            </Text>
          </HStack>
          <Flex justifyContent="center">
            <Text fontWeight={700} fontSize="lg">
              {index + 1} / {numTerms}
            </Text>
          </Flex>
          <Flex justifyContent="end">
            <HStack spacing={2}>
              <SetCreatorOnly studySetId={term.studySetId}>
                <IconButton
                  icon={<IconEditCircle />}
                  aria-label="Edit"
                  rounded="full"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestEdit();
                  }}
                />
              </SetCreatorOnly>
              <IconButton
                icon={<Star />}
                aria-label="Star"
                rounded="full"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestStar();
                }}
              />
            </HStack>
          </Flex>
        </Grid>
        <Center flex={1} my="4" ref={containerRef} overflowY="auto">
          <PureShrinkableText
            text={isFlipped ? term.definition : term.word}
            container={containerRef}
          />
        </Center>
        <HStack spacing={4}>
          <Button
            w="full"
            size="lg"
            variant="outline"
            colorScheme={variant == "sortable" ? "red" : "blue"}
            borderColor={buttonBorder}
            isDisabled={variant == "default" && index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onLeftAction();
            }}
          >
            <Box color={variant == "sortable" ? leftColor : genericColor}>
              <LeftIcon size="24" />
            </Box>
          </Button>
          <Button
            w="full"
            size="lg"
            variant="outline"
            colorScheme={variant == "sortable" ? "green" : "blue"}
            borderColor={buttonBorder}
            isDisabled={variant == "default" && index === numTerms - 1}
            onClick={(e) => {
              e.stopPropagation();
              onRightAction();
            }}
          >
            <Box color={variant == "sortable" ? rightColor : genericColor}>
              <RightIcon size="24" />
            </Box>
          </Button>
        </HStack>
      </Flex>
      <Box
        bg="orange.300"
        height="1"
        minH="1"
        style={{
          visibility: isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
    </Card>
  );
};

const ShrinkableText: React.FC<{
  text: string;
  container: React.RefObject<HTMLDivElement>;
}> = ({ text, container }) => {
  const { fontSize, ref } = useFitText({
    minFontSize: 50,
  });

  return (
    <span
      ref={ref}
      style={{
        maxHeight: container.current
          ? `calc(${container.current.clientHeight}px)`
          : undefined,
        fontSize: (36 * parseFloat(fontSize.replace("%", ""))) / 100,
        fontWeight: 400,
        fontFamily: "Outfit",
        whiteSpace: "pre-wrap",
        display: "table-cell",
        verticalAlign: "middle",
        textAlign: "center",
        overflowWrap: "anywhere",
      }}
    >
      <ScriptFormatter>{text}</ScriptFormatter>
    </span>
  );
};

const PureShrinkableText = React.memo(ShrinkableText);
