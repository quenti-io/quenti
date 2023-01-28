import React from "react";
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
import type { Term } from "@prisma/client";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";

export interface FlashcardProps {
  term: Term;
  isFlipped: boolean;
  index: number;
  numTerms: number;
  starred: boolean;
  h?: string;
  onPrev: () => void;
  onNext: () => void;
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
  onPrev,
  onNext,
  onRequestEdit,
  onRequestStar,
}) => {
  const Star = starred ? IconStarFilled : IconStar;

  return (
    <Card w="full" h={h} rounded="xl" shadow="xl" overflow="hidden">
      <Box
        bg="orange.300"
        height="1"
        style={{
          visibility: !isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
      <Flex flexDir="column" h="full" p="8">
        <Grid templateColumns="1fr 1fr 1fr">
          <Text fontWeight={700} color="gray.500">
            {isFlipped ? "Definition" : "Term"}
          </Text>
          <Flex justifyContent="center">
            <Text fontWeight={700} fontSize="lg">
              {index + 1} / {numTerms}
            </Text>
          </Flex>
          <Flex justifyContent="end">
            <HStack spacing={2}>
              <IconButton
                icon={<IconEdit />}
                aria-label="Edit"
                rounded="full"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestEdit();
                }}
              />
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
        <Center flex="1">
          <Text
            fontSize="4xl"
            fontWeight={400}
            textAlign="center"
            fontFamily="Outfit"
          >
            {isFlipped ? term.definition : term.word}
          </Text>
        </Center>
        <HStack spacing={4}>
          <Button
            w="full"
            size="lg"
            variant="outline"
            isDisabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <IconChevronLeft
              size="24"
              color={useColorModeValue("black", "white")}
            />
          </Button>
          <Button
            w="full"
            size="lg"
            variant="outline"
            isDisabled={index === numTerms - 1}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <IconChevronRight
              size="24"
              color={useColorModeValue("black", "white")}
            />
          </Button>
        </HStack>
      </Flex>
      <Box
        bg="orange.300"
        height="1"
        style={{
          visibility: isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
    </Card>
  );
};
