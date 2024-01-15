import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type Editor,
  EditorContent,
  type JSONContent,
  useEditor,
} from "@tiptap/react";
import { motion } from "framer-motion";
import React from "react";

import { languageName } from "@quenti/core/language";
import { editorInput, getPlainText, hasRichText } from "@quenti/lib/editor";

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

import { resize } from "../../../common/cdn-loaders";
import { PhotoView } from "../../../components/photo-view/photo-view";
import { editorEventChannel } from "../../../events/editor";
import { useSetEditorContext } from "../../../stores/use-set-editor-store";
import { CharacterSuggestionsPure } from "../character-suggestions";
import { editorAttributes, editorConfig } from "../editor-config";
import { DeloadedDisplayable } from "./deloaded-card";
import { AddImageButton, RemoveImageButton } from "./image-components";
import { RichTextBar } from "./rich-text-bar";
import type { SortableTermCardProps } from "./sortable-term-card";

const MotionStack = motion(Stack);

export interface InnerTermCardProps extends SortableTermCardProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

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

  const [wordFocused, setWordFocused] = React.useState(false);
  const [definitionFocused, setDefinitionFocused] = React.useState(false);

  const wordFocusedRef = React.useRef(wordFocused);
  wordFocusedRef.current = wordFocused;
  const definitionFocusedRef = React.useRef(definitionFocused);
  definitionFocusedRef.current = definitionFocused;

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

  const [wordEmpty, setWordEmpty] = React.useState(false);
  const [definitionEmpty, setDefinitionEmpty] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const id = useSetEditorContext((s) => s.id);
  const readonly = useSetEditorContext((s) => s.readonly);
  const setCurrentActive = useSetEditorContext((s) => s.setCurrentActiveRank);
  const removeImage = useSetEditorContext((s) => s.removeImage);

  const wordEditor = useEditor({
    ...editorConfig(term.rank + 1),
    content: editorInput(term, "word"),
    onUpdate: ({ editor }) => {
      setWordEmpty(editor.isEmpty);
    },
    onCreate: ({ editor }) => {
      setWordEmpty(editor.isEmpty);
      if (justCreated) editor.chain().focus();
    },
  });
  const wordRef = React.useRef(wordEditor);
  wordRef.current = wordEditor;

  const definitionEditor = useEditor({
    ...editorConfig(term.rank + 2),
    content: editorInput(term, "definition"),
    onUpdate: ({ editor }) => {
      setDefinitionEmpty(editor.isEmpty);
    },
    onCreate: ({ editor }) => {
      setDefinitionEmpty(editor.isEmpty);
    },
  });
  const definitionRef = React.useRef(definitionEditor);
  definitionRef.current = definitionEditor;

  const activeEditor = wordFocused
    ? wordRef.current
    : definitionFocused
      ? definitionRef.current
      : null;

  React.useEffect(() => {
    if (wordFocused || definitionFocused) setCurrentActive(term.rank);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordFocused, definitionFocused]);

  React.useEffect(() => {
    if (!initialized) return;
    wordEditor?.commands.setContent(editorInput(term, "word"));
    definitionEditor?.commands.setContent(editorInput(term, "definition"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term.word, term.definition]);

  React.useEffect(() => {
    wordRef.current?.setOptions({
      editorProps: {
        attributes: editorAttributes(term.rank + 1),
      },
    });
    definitionRef.current?.setOptions({
      editorProps: {
        attributes: editorAttributes(term.rank + 2),
      },
    });
  }, [term.rank]);

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

  const handleInsert = (c: string, editor: Editor) => {
    const cursor = editor.state.selection.$anchor.pos;
    editor.commands.insertContentAt(cursor, c);
  };

  const insertWord = React.useCallback(
    (c: string) => handleInsert(c, wordRef.current!),
    [],
  );
  const insertDefinition = React.useCallback(
    (c: string) => handleInsert(c, definitionRef.current!),
    [],
  );

  const blurWord = React.useCallback(() => {
    setWordFocused(false);
    // Timeout is neccesary if clicked to or tabbed immediately
    setTimeout(() => {
      editIfDirty(definitionFocusedRef.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, wordEditor, definitionEditor]);

  const blurDefinition = React.useCallback(() => {
    setDefinitionFocused(false);
    setTimeout(() => {
      editIfDirty(wordFocusedRef.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, wordEditor, definitionEditor]);

  const getEditorPlainTexts = () => {
    const wordJson = wordEditor!.getJSON();
    const definitionJson = definitionEditor!.getJSON();
    const word = getPlainText(wordJson);
    const definition = getPlainText(definitionJson);
    return { word, definition, wordJson, definitionJson };
  };

  const getTermDelta = () => {
    const { word, definition, wordJson, definitionJson } =
      getEditorPlainTexts();

    const wordRichText = hasRichText(wordJson, word);
    const definitionRichText = hasRichText(definitionJson, definition);

    const compareJson = (
      one?: JSONContent | JSON | null,
      two?: JSONContent | JSON | null,
    ) => {
      const left = JSON.stringify(one || "");
      const right = JSON.stringify(two || "");
      return left === right;
    };

    const isDirty =
      word !== term.word ||
      definition !== term.definition ||
      ((wordRichText || term.wordRichText) &&
        !compareJson(wordJson, term.wordRichText)) ||
      ((definitionRichText || term.definitionRichText) &&
        !compareJson(definitionJson, term.definitionRichText));

    return {
      word,
      definition,
      wordJson,
      definitionJson,
      wordRichText,
      definitionRichText,
      isDirty,
    };
  };

  const editIfDirty = (focused: boolean) => {
    const {
      isDirty,
      word,
      definition,
      wordJson,
      definitionJson,
      wordRichText,
      definitionRichText,
    } = getTermDelta();

    if (isDirty && !focused) {
      setAdded(true);

      editTerm(
        term.id,
        word,
        definition,
        wordRichText ? (wordJson as JSON) : undefined,
        definitionRichText ? (definitionJson as JSON) : undefined,
      );
    }
  };

  return (
    <MotionStack
      ref={cardRef}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
    >
      <Flex
        align="center"
        borderBottom="2px"
        borderColor={borderColor}
        roundedTop="xl"
        px="5"
        py="10px"
        justify="space-between"
      >
        <Text fontWeight={700} fontFamily="heading" w="72px">
          {term.rank + 1}
        </Text>
        {isCurrent && !readonly && <RichTextBar activeEditor={activeEditor} />}
        <ButtonGroup size="sm" isDisabled={readonly}>
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
            isDisabled={readonly || !deletable}
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
          sd: "row",
        }}
      >
        <Stack w="full" spacing={2}>
          <Box pos="relative">
            {(initialized || justCreated) && !readonly ? (
              <EditorContent
                editor={wordEditor}
                onFocus={() => setWordFocused(true)}
                onBlur={blurWord}
              >
                {wordEmpty && (
                  <Text
                    position="absolute"
                    top="7px"
                    left="0"
                    color="gray.500"
                    className="editor-placeholder"
                    pointerEvents="none"
                  >
                    Enter {placeholderTerm}
                  </Text>
                )}
              </EditorContent>
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
            {(initialized || justCreated) && !readonly ? (
              <EditorContent
                editor={definitionEditor}
                placeholder={`Enter ${placeholderDefinition}`}
                onFocus={() => setDefinitionFocused(true)}
                onBlur={blurDefinition}
                onKeyDown={(e) => {
                  if (isLast && e.key == "Tab" && !e.shiftKey) {
                    e.preventDefault();
                    onTabOff();
                  }
                }}
              >
                {definitionEmpty && (
                  <Text
                    position="absolute"
                    top="7px"
                    left="0"
                    color="gray.500"
                    className="editor-placeholder"
                    pointerEvents="none"
                  >
                    Enter {placeholderDefinition}
                  </Text>
                )}
              </EditorContent>
            ) : (
              <DeloadedDisplayable>{term.definition}</DeloadedDisplayable>
            )}
            {isCurrent && !readonly && (
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
        <Box mt="1" minW="80px" h="60px" position="relative">
          {term.assetUrl ? (
            <>
              <PhotoView
                src={resize({ src: term.assetUrl, width: 500 })}
                borderRadius={12}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="80x"
                  height="60px"
                  src={resize({ src: term.assetUrl, width: 500 })}
                  alt={`Image for ${term.definition}`}
                  style={{
                    cursor: "zoom-in",
                    objectFit: "cover",
                    width: "80px",
                    height: "60px",
                    borderRadius: "0.75rem",
                  }}
                />
              </PhotoView>
              {!readonly && (
                <RemoveImageButton onClick={() => removeImage(term.id)} />
              )}
            </>
          ) : (
            <AddImageButton
              isDisabled={readonly}
              onClick={() => {
                const {
                  isDirty,
                  word,
                  definition,
                  wordJson,
                  definitionJson,
                  wordRichText,
                  definitionRichText,
                } = getTermDelta();

                // Empty term needs to be added
                if (!isDirty && !added) {
                  editTerm(
                    term.id,
                    word,
                    definition,
                    wordRichText ? (wordJson as JSON) : undefined,
                    definitionRichText ? (definitionJson as JSON) : undefined,
                  );
                }

                editorEventChannel.emit("openSearchImages", {
                  termId: term.id,
                  studySetId: id,
                });
              }}
            />
          )}
        </Box>
      </HStack>
    </MotionStack>
  );
};

export const InnerTermCard = React.memo(InnerTermCardRaw);
