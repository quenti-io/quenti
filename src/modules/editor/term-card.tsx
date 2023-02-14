import {
  Card,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AutoSaveTerm, Language, Term } from "@prisma/client";
import { IconGripHorizontal, IconTrash } from "@tabler/icons-react";
import React from "react";
import { LanguageMenu } from "./language-menu";

interface TermCardProps {
  isCurrent: boolean;
  term: Term | AutoSaveTerm;
  deletable: boolean;
  wordLanguage: Language;
  definitionLanguage: Language;
  editTerm: (id: string, word: string, definition: string) => void;
  deleteTerm: (id: string) => void;
  setWordLanguage: (l: Language) => void;
  setDefinitionLanguage: (l: Language) => void;
  anyFocus: () => void;
}

export const TermCard: React.FC<TermCardProps> = ({
  isCurrent,
  term,
  deletable,
  wordLanguage,
  definitionLanguage,
  editTerm,
  deleteTerm,
  setWordLanguage,
  setDefinitionLanguage,
  anyFocus,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: term.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2000 : undefined,
  };

  const [word, setWord] = React.useState(term.word);
  const [definition, setDefinition] = React.useState(term.definition);

  const [wordFocused, setWordFocused] = React.useState(false);
  const [definitionFocused, setDefinitionFocused] = React.useState(false);

  React.useEffect(() => {
    if (wordFocused || definitionFocused) anyFocus();
  }, [wordFocused, definitionFocused, anyFocus]);

  React.useEffect(() => {
    setWord(term.word);
    setDefinition(term.definition);
  }, [term.word, term.definition]);

  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
    <Card
      position="relative"
      ref={setNodeRef}
      style={style}
      shadow={isDragging ? "xl" : "lg"}
    >
      <Stack>
        <Flex
          align="center"
          borderBottom="4px"
          borderColor={useColorModeValue("gray.200", "gray.900")}
          roundedTop="md"
          bg={useColorModeValue("gray.100", "gray.750")}
          px="5"
          py="3"
          justify="space-between"
        >
          <Text fontWeight={700}>{term.rank + 1}</Text>
          <HStack>
            <IconButton
              icon={<IconGripHorizontal />}
              aria-label="Reorder"
              variant="ghost"
              {...attributes}
              {...listeners}
            />
            <IconButton
              icon={<IconTrash />}
              aria-label="Delete"
              variant="ghost"
              isDisabled={!deletable}
              onClick={() => deleteTerm(term.id)}
            />
          </HStack>
        </Flex>
        <HStack px="5" pt="2" pb="6" spacing={6}>
          <Stack w="full" spacing={2}>
            <Input
              placeholder="Enter term"
              variant="flushed"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onFocus={() => setWordFocused(true)}
              onBlur={() => {
                setWordFocused(false);
                setTimeout(() => {
                  setDefinitionFocused((focused) => {
                    if (
                      (word !== term.word || definition !== term.definition) &&
                      !focused
                    )
                      editTerm(term.id, word, definition);
                    return focused;
                  });
                });
              }}
            />
            <Flex justifyContent="space-between">
              <Text fontSize="sm" color={mutedText}>
                Term
              </Text>
              {isCurrent && (
                <LanguageMenu
                  selected={wordLanguage}
                  onChange={setWordLanguage}
                />
              )}
            </Flex>
          </Stack>
          <Stack w="full" spacing={2}>
            <Input
              placeholder="Enter definition"
              variant="flushed"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              onFocus={() => setDefinitionFocused(true)}
              onBlur={() => {
                setDefinitionFocused(false);
                setTimeout(() => {
                  setWordFocused((focused) => {
                    if (
                      (word !== term.word || definition !== term.definition) &&
                      !focused
                    )
                      editTerm(term.id, word, definition);
                    return focused;
                  });
                });
              }}
            />
            <Flex justifyContent="space-between">
              <Text fontSize="sm" color={mutedText}>
                Definition
              </Text>
              {isCurrent && (
                <LanguageMenu
                  selected={definitionLanguage}
                  onChange={setDefinitionLanguage}
                />
              )}
            </Flex>
          </Stack>
        </HStack>
      </Stack>
    </Card>
  );
};
