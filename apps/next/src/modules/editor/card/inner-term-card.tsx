import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TextExtension from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import { languageName } from "@quenti/core/language";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  PopoverAnchor,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconGripHorizontal, IconTrash } from "@tabler/icons-react";

import { getPlainText, plainTextToHtml } from "../../../utils/editor";
import { CharacterSuggestionsPure } from "../character-suggestions";
import { DeloadedDisplayable } from "./deloaded-card";
import type { SortableTermCardProps } from "./sortable-term-card";

export interface InnerTermCardProps extends SortableTermCardProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

const editorConfig = (tabIndex: number): Parameters<typeof useEditor>[0] => ({
  extensions: [Document, Paragraph, TextExtension],
  editorProps: {
    attributes: {
      tabindex: `${tabIndex}`,
      class: `focus:outline-none py-[7px] border-b-[1px] border-b-[var(--chakra-colors-gray-200)] dark:border-b-[var(--chakra-colors-gray-600)] focus:border-b-[var(--chakra-colors-blue-300)]`,
    },
  },
});

export const InnerTermCardRaw: React.FC<InnerTermCardProps> = ({
  isCurrent,
  term,
  deletable,
  justCreated,
  isLast,
  wordLanguage,
  definitionLanguage,
  openMenu,
  editTerm,
  deleteTerm,
  anyFocus,
  onTabOff,
  attributes,
  listeners,
}) => {
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    setInitialized(true);
  }, [setInitialized]);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const wordRef = React.useRef<HTMLTextAreaElement>(null);
  const definitionRef = React.useRef<HTMLTextAreaElement>(null);

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

  const placeholderTerm =
    wordLanguage != definitionLanguage ? languageName(wordLanguage) : "term";
  const placeholderDefinition =
    wordLanguage != definitionLanguage
      ? languageName(definitionLanguage)
      : "definition";

  const wordEditor = useEditor({
    ...editorConfig(term.rank + 1),
    content: plainTextToHtml(term.word),
  });
  const editorRef = React.useRef(wordEditor);
  editorRef.current = wordEditor;

  const definitionEditor = useEditor({
    ...editorConfig(term.rank + 2),
    content: plainTextToHtml(term.definition),
  });

  React.useEffect(() => {
    if (justCreated) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          editorRef.current?.chain().focus();
        });
      });
    }
  }, [justCreated]);

  React.useEffect(() => {
    if (!initialized) return;
    wordEditor?.commands.setContent(plainTextToHtml(term.word));
    definitionEditor?.commands.setContent(plainTextToHtml(term.definition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term.word, term.definition]);

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
  const borderColor = useColorModeValue("gray.50", "gray.700");

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

    // if (ref === wordRef) setWord(el.value);
    // else setDefinition(el.value);
  };

  const insertWord = React.useCallback(
    (c: string) => handleInsert(c, wordRef),
    [],
  );
  const insertDefinition = React.useCallback(
    (c: string) => handleInsert(c, definitionRef),
    [],
  );

  const getEditorPlainTexts = () => {
    const word = getPlainText(wordEditor!.getJSON());
    const definition = getPlainText(definitionEditor!.getJSON());
    return { word, definition };
  };

  const editIfDirty = (focused: boolean) => {
    const { word, definition } = getEditorPlainTexts();
    if ((word !== term.word || definition !== term.definition) && !focused) {
      editTerm(term.id, word, definition);
    }
  };

  return (
    <Stack ref={cardRef}>
      <Flex
        align="center"
        borderBottom="2px"
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
      <HStack
        px="5"
        pb="4"
        spacing={6}
        alignItems="start"
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Stack w="full" spacing={2}>
          <Box pos="relative" onFocusCapture={() => setWordFocused(true)}>
            {initialized || justCreated ? (
              <EditorContent
                editor={wordEditor}
                placeholder={`Enter ${placeholderTerm}`}
                onFocus={() => setWordFocused(true)}
                onBlur={() => {
                  setWordFocused(false);
                  // Timeout is neccesary if clicked to or tabbed immediately
                  setTimeout(() => {
                    setDefinitionFocused((focused) => {
                      editIfDirty(focused);
                      return focused;
                    });
                  });
                }}
              />
            ) : (
              <DeloadedDisplayable>{term.word}</DeloadedDisplayable>
            )}
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
            {initialized || justCreated ? (
              <EditorContent
                height="40px"
                style={{
                  overflow: "hidden",
                }}
                editor={definitionEditor}
                placeholder={`Enter ${placeholderDefinition}`}
                onFocus={() => setDefinitionFocused(true)}
                onBlur={() => {
                  setDefinitionFocused(false);
                  setTimeout(() => {
                    setWordFocused((focused) => {
                      editIfDirty(focused);
                      return focused;
                    });
                  });
                }}
                onKeyDown={(e) => {
                  if (isLast && e.key == "Tab" && !e.shiftKey) {
                    e.preventDefault();
                    onTabOff();
                  }
                }}
              />
            ) : (
              <DeloadedDisplayable>{term.definition}</DeloadedDisplayable>
            )}
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
  );
};

export const InnerTermCard = React.memo(InnerTermCardRaw);