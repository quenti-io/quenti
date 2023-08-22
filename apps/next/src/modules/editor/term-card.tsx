import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import React from "react";

import { languageName } from "@quenti/core/language";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Flex,
  HStack,
  IconButton,
  PopoverAnchor,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconGripHorizontal, IconTrash } from "@tabler/icons-react";

import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { CharacterSuggestionsPure } from "./character-suggestions";
import type { SortableTermCardProps } from "./sortable-term-card";

export interface TermCardProps extends SortableTermCardProps {
  style: React.CSSProperties;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

type TermCardRef = HTMLDivElement;

export const TermCard = React.forwardRef<TermCardRef, TermCardProps>(
  function TermCardInner(
    {
      isCurrent,
      term,
      deletable,
      justCreated,
      wordLanguage,
      definitionLanguage,
      openMenu,
      editTerm,
      deleteTerm,
      anyFocus,
      onTabOff,
      style,
      attributes,
      listeners,
    },
    ref,
  ) {
    const { colorMode } = useColorMode();
    const wordRef = React.useRef<HTMLTextAreaElement>(null);
    const definitionRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      if (justCreated) {
        requestAnimationFrame(() => {
          wordRef.current?.focus();
        });
      }
    }, [justCreated]);

    const [word, setWord] = React.useState(term.word);
    const [definition, setDefinition] = React.useState(term.definition);

    const [wordFocused, setWordFocused] = React.useState(false);
    const [definitionFocused, setDefinitionFocused] = React.useState(false);
    const [lastFocused, setLastFocused] = React.useState<
      "word" | "definition" | null
    >(null);

    React.useEffect(() => {
      if (wordFocused || definitionFocused) {
        anyFocus();
        setLastFocused(wordFocused ? "word" : "definition");
      }
    }, [wordFocused, definitionFocused, anyFocus]);

    React.useEffect(() => {
      setWord(term.word);
      setDefinition(term.definition);
    }, [term.word, term.definition]);

    const placeholderTerm =
      wordLanguage != definitionLanguage ? languageName(wordLanguage) : "term";
    const placeholderDefinition =
      wordLanguage != definitionLanguage
        ? languageName(definitionLanguage)
        : "definition";

    const LanguageButton = ({ type }: { type: "word" | "definition" }) => {
      if (!isCurrent || lastFocused !== type) return null;

      return (
        <PopoverAnchor>
          <Button
            size="sm"
            variant="ghost"
            h="max"
            onPointerDown={() => {
              openMenu(type);
            }}
          >
            {languageName(type == "word" ? wordLanguage : definitionLanguage)}
          </Button>
        </PopoverAnchor>
      );
    };
    const LanguageButtonPure = React.memo(LanguageButton);

    const mutedText = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const bg = useColorModeValue("white", "gray.750");

    const handleInsert = (
      c: string,
      ref: React.RefObject<HTMLTextAreaElement>,
    ) => {
      const el = ref.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = el.value;

      const before = value.substring(0, start);
      const after = value.substring(end, value.length);

      el.value = before + c + after;
      el.selectionStart = el.selectionEnd = start + c.length;
      el.focus();

      if (ref === wordRef) setWord(el.value);
      else setDefinition(el.value);
    };

    const insertWord = React.useCallback(
      (c: string) => handleInsert(c, wordRef),
      [],
    );
    const insertDefinition = React.useCallback(
      (c: string) => handleInsert(c, definitionRef),
      [],
    );

    return (
      <Card
        position="relative"
        ref={ref}
        style={style}
        bg={bg}
        rounded="xl"
        borderColor={borderColor}
        borderWidth="2px"
      >
        {React.useMemo(
          () => (
            <Stack>
              <Flex
                align="center"
                borderBottom="2px"
                bg="gray.50"
                _dark={{
                  bg: "gray.800",
                }}
                borderColor={borderColor}
                roundedTop="xl"
                px="5"
                py="10px"
                justify="space-between"
              >
                <Text fontWeight={700} fontFamily="heading">
                  {term.rank + 1}
                </Text>
                <ButtonGroup size="sm">
                  <IconButton
                    icon={<IconGripHorizontal size={18} />}
                    aria-label="Reorder"
                    variant="ghost"
                    {...attributes}
                    {...listeners}
                  />
                  <IconButton
                    icon={<IconTrash size={18} />}
                    aria-label="Delete"
                    variant="ghost"
                    isDisabled={!deletable}
                    onClick={() => deleteTerm(term.id)}
                  />
                </ButtonGroup>
              </Flex>
              <HStack px="5" pb="4" spacing={6} alignItems="start">
                <Stack w="full" spacing={2}>
                  <Box pos="relative">
                    <AutoResizeTextarea
                      allowTab={false}
                      placeholder={`Enter ${placeholderTerm}`}
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
                    {isCurrent && (
                      <CharacterSuggestionsPure
                        language={wordLanguage}
                        focused={wordFocused}
                        onSelect={insertWord}
                        onLanguageClick={() => openMenu("word")}
                      />
                    )}
                  </Box>
                  <Flex justifyContent="space-between" h="6">
                    <Text fontSize="sm" color={mutedText}>
                      Term
                    </Text>
                    <LanguageButtonPure type="word" />
                  </Flex>
                </Stack>
                <Stack w="full" spacing={2}>
                  <Box pos="relative">
                    <AutoResizeTextarea
                      allowTab={false}
                      placeholder={`Enter ${placeholderDefinition}`}
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
                    {isCurrent && (
                      <CharacterSuggestionsPure
                        language={definitionLanguage}
                        focused={definitionFocused}
                        onSelect={insertDefinition}
                        onLanguageClick={() => openMenu("definition")}
                      />
                    )}
                  </Box>
                  <Flex justifyContent="space-between">
                    <Text fontSize="sm" color={mutedText} h="6">
                      Definition
                    </Text>
                    <LanguageButtonPure type="definition" />
                  </Flex>
                </Stack>
              </HStack>
            </Stack>
          ),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [
            word,
            term.rank,
            definition,
            lastFocused,
            wordFocused,
            definitionFocused,
            isCurrent,
            wordLanguage,
            definitionLanguage,
            colorMode, // Theme changes should update the card
          ],
        )}
      </Card>
    );
  },
);

export const TermCardPure = React.memo(TermCard);
