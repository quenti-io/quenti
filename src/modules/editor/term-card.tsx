import {
  Card,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { AutoSaveTerm, Language, Term } from "@prisma/client";
import { IconGripHorizontal, IconTrash } from "@tabler/icons-react";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
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
  onTabOff: () => void;
}

export const TermCard: React.FC<TermCardProps> = ({
  isCurrent,
  term,
  deletable,
  wordLanguage: _wordLanguage,
  definitionLanguage: _definitionLanguage,
  editTerm,
  deleteTerm,
  setWordLanguage,
  setDefinitionLanguage,
  anyFocus,
  onTabOff,
}) => {
  const wordRef = React.useRef<HTMLTextAreaElement>(null);
  const definitionRef = React.useRef<HTMLTextAreaElement>(null);

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
  const borderColor = useColorModeValue("gray.200", "gray.900");
  const bg = useColorModeValue("gray.100", "gray.750");

  const wordLanguage = isCurrent ? _wordLanguage : "";
  const definitionLanguage = isCurrent ? _definitionLanguage : "";

  return React.useMemo(
    () => (
      <Card position="relative">
        <Stack>
          <Flex
            align="center"
            borderBottom="4px"
            borderColor={borderColor}
            roundedTop="md"
            bg={bg}
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
          <HStack px="5" pt="2" pb="6" spacing={6} alignItems="start">
            <Stack w="full" spacing={2}>
              <AutoResizeTextarea
                allowTab={false}
                placeholder="Enter term"
                variant="flushed"
                value={word}
                ref={wordRef}
                tabIndex={term.rank + 1}
                onChange={(e) => setWord(e.target.value)}
                onFocus={() => setWordFocused(true)}
                onBlur={() => {
                  setWordFocused(false);
                  setTimeout(() => {
                    setDefinitionFocused((focused) => {
                      if (
                        (word !== term.word ||
                          definition !== term.definition) &&
                        !focused
                      )
                        editTerm(term.id, word, definition);
                      return focused;
                    });
                  });
                }}
              />
              <Flex justifyContent="space-between" h="6">
                <Text fontSize="sm" color={mutedText}>
                  Term
                </Text>
                {isCurrent && !!wordLanguage.length && (
                  <LanguageMenu
                    selected={wordLanguage as Language}
                    onChange={setWordLanguage}
                  />
                )}
              </Flex>
            </Stack>
            <Stack w="full" spacing={2}>
              <AutoResizeTextarea
                allowTab={false}
                placeholder="Enter definition"
                variant="flushed"
                value={definition}
                ref={definitionRef}
                tabIndex={term.rank + 2}
                onChange={(e) => setDefinition(e.target.value)}
                onFocus={() => setDefinitionFocused(true)}
                onBlur={() => {
                  setDefinitionFocused(false);
                  setTimeout(() => {
                    setWordFocused((focused) => {
                      if (
                        (word !== term.word ||
                          definition !== term.definition) &&
                        !focused
                      )
                        editTerm(term.id, word, definition);
                      return focused;
                    });
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key == "Tab" && !e.shiftKey) onTabOff();
                }}
              />
              <Flex justifyContent="space-between">
                <Text fontSize="sm" color={mutedText} h="6">
                  Definition
                </Text>
                {isCurrent && !!definitionLanguage.length && (
                  <LanguageMenu
                    selected={definitionLanguage as Language}
                    onChange={setDefinitionLanguage}
                  />
                )}
              </Flex>
            </Stack>
          </HStack>
        </Stack>
      </Card>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      word,
      term.rank,
      definition,
      wordFocused,
      definitionFocused,
      isCurrent,
      wordLanguage,
      definitionLanguage,
    ]
  );
};

export const TermCardPure = React.memo(TermCard);
