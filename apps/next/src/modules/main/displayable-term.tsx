import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import { useSession } from "next-auth/react";
import React from "react";

import { Display } from "@quenti/components/display";
import type { FacingTerm } from "@quenti/interfaces";
import {
  type EditorTerm,
  editorInput,
  getPlainText,
  hasRichText,
  richTextToHtml,
} from "@quenti/lib/editor";
import { api } from "@quenti/trpc";

import {
  Box,
  Card,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconEditCircle, IconStar, IconStarFilled } from "@tabler/icons-react";

import { resize } from "../../common/cdn-loaders";
import { PhotoView } from "../../components/photo-view/photo-view";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { TermAuthorAvatar } from "../../components/term-author-avatar";
import { editorEventChannel } from "../../events/editor";
import { menuEventChannel } from "../../events/menu";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useSet } from "../../hooks/use-set";
import { useContainerContext } from "../../stores/use-container-store";
import {
  AddImageButton,
  RemoveImageButton,
} from "../editor/card/image-components";
import { RichTextBar } from "../editor/card/rich-text-bar";
import { editorConfig } from "../editor/editor-config";

export interface DisplayableTermProps {
  term: FacingTerm;
}

export const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term }) => {
  const authed = useSession().status == "authenticated";
  const utils = api.useUtils();

  const starMutation = api.container.starTerm.useMutation();
  const unstarMutation = api.container.unstarTerm.useMutation();
  const removeImage = api.terms.removeImage.useMutation();

  const { container } = useSet();
  const starredTerms = useContainerContext((s) => s.starredTerms);
  const starTerm = useContainerContext((s) => s.starTerm);
  const unstarTerm = useContainerContext((s) => s.unstarTerm);

  const starred = starredTerms.includes(term.id);
  const Star = starred ? IconStarFilled : IconStar;

  const [isEditing, setIsEditing] = React.useState(false);
  const [assetUrl, setAssetUrl] = React.useState(term.assetUrl);

  React.useEffect(() => {
    setAssetUrl(term.assetUrl);
  }, [term.assetUrl]);

  React.useEffect(() => {
    const handle = (args: { id: string; url: string }) => {
      if (args.id == term.id) setAssetUrl(args.url);
    };

    editorEventChannel.on("propagateImageUrl", handle);
    return () => {
      editorEventChannel.off("propagateImageUrl", handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wordEditor = useEditor({
    ...editorConfig(term.rank + 1),
    content: editorInput(term as EditorTerm, "word"),
  });
  const definitionEditor = useEditor({
    ...editorConfig(term.rank + 1),
    content: editorInput(term as EditorTerm, "definition"),
  });

  const edit = api.terms.edit.useMutation({
    async onSuccess() {
      await utils.studySets.invalidate();
    },
  });

  const [cache, setCache] = React.useState({
    word: term.word,
    definition: term.definition,
    wordRichText: term.wordRichText as JSONContent | null,
    definitionRichText: term.definitionRichText as JSONContent | null,
  });

  React.useEffect(() => {
    setCache({
      word: term.word,
      definition: term.definition,
      wordRichText: term.wordRichText as JSONContent | null,
      definitionRichText: term.definitionRichText as JSONContent | null,
    });
  }, [term.word, term.definition, term.wordRichText, term.definitionRichText]);

  const getEditorPlainTexts = () => {
    const wordJson = wordEditor!.getJSON();
    const definitionJson = definitionEditor!.getJSON();
    const word = getPlainText(wordJson);
    const definition = getPlainText(definitionJson);
    return { word, definition, wordJson, definitionJson };
  };

  const doEdit = () => {
    setIsEditing((e) => {
      if (e) {
        const { word, definition, wordJson, definitionJson } =
          getEditorPlainTexts();

        const wordRichText = hasRichText(wordJson, word);
        const definitionRichText = hasRichText(definitionJson, definition);

        const values = {
          word,
          definition,
          wordRichText: wordRichText ? wordJson : null,
          definitionRichText: definitionRichText ? definitionJson : null,
        };

        setCache(values);

        void edit.mutateAsync({
          id: term.id,
          studySetId: term.studySetId,
          ...values,
          wordRichText: wordRichText ? richTextToHtml(wordJson) : undefined,
          definitionRichText: definitionRichText
            ? richTextToHtml(definitionJson)
            : undefined,
        });
      }

      return false;
    });
  };

  const ref = useOutsideClick(doEdit);

  return (
    <Card
      ref={ref}
      px={{ base: 0, md: "22px" }}
      py={{ base: 0, md: 5 }}
      shadow="0 2px 6px -4px rgba(0, 0, 0, 0.1), 0 2px 4px -4px rgba(0, 0, 0, 0.06)"
      borderWidth="1.5px"
      transition="border-color 0.15s ease-in-out"
      borderColor={isEditing ? "blue.100" : "gray.100"}
      rounded="xl"
      _dark={{
        bg: "gray.750",
        borderColor: isEditing ? "#4b83ff50" : "gray.700",
      }}
    >
      <Flex
        flexDir={{ base: "column-reverse", md: "row" }}
        alignItems="stretch"
        gap={{ base: 0, md: 6 }}
      >
        <Flex
          w="full"
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 6 }}
          px={{ base: 3, md: 0 }}
          py={{ base: 3, md: 0 }}
        >
          {term.author && <TermAuthorAvatar user={term.author} />}
          {isEditing ? (
            <Stack w="full">
              <RichTextBar activeEditor={wordEditor} />
              <EditorContent
                editor={wordEditor}
                onKeyDown={(e) => {
                  if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                    e.stopPropagation();
                }}
              />
            </Stack>
          ) : (
            <Text
              w="full"
              whiteSpace="pre-wrap"
              overflowWrap="anywhere"
              lineHeight={1.6}
            >
              <Display text={cache.word} richText={cache.wordRichText} />
            </Text>
          )}
          <Box
            bg="gray.100"
            _dark={{
              bg: "gray.700",
            }}
            h="full"
            rounded="full"
            w="4px"
          />
          {isEditing ? (
            <Stack w="full">
              <RichTextBar activeEditor={definitionEditor} />
              <EditorContent
                editor={definitionEditor}
                onKeyDown={(e) => {
                  if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                    e.stopPropagation();
                }}
              />
            </Stack>
          ) : (
            <Text
              w="full"
              whiteSpace="pre-wrap"
              overflowWrap="anywhere"
              lineHeight={1.6}
            >
              <Display
                text={cache.definition}
                richText={cache.definitionRichText}
              />
            </Text>
          )}
          <Box minW="100px">
            {assetUrl && (
              <Box
                minW="100px"
                h="80px"
                mt={{ base: 3, md: 0 }}
                position="relative"
              >
                <PhotoView src={resize({ src: assetUrl, width: 500 })}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width={100}
                    height={80}
                    alt="Term asset"
                    src={resize({ src: assetUrl, width: 500 })}
                    style={{
                      cursor: "zoom-in",
                      width: 100,
                      height: 80,
                      objectFit: "cover",
                      aspectRatio: "5 / 4",
                      borderRadius: "6px",
                    }}
                  />
                </PhotoView>
                {isEditing && (
                  <RemoveImageButton
                    onClick={() => {
                      setAssetUrl(null);
                      removeImage.mutate({
                        id: term.id,
                        studySetId: term.studySetId,
                      });
                    }}
                  />
                )}
              </Box>
            )}
            {isEditing && !assetUrl && (
              <AddImageButton
                w="100px"
                h="80px"
                onClick={() => {
                  editorEventChannel.emit("openSearchImages", {
                    termId: term.id,
                    studySetId: term.studySetId,
                  });
                }}
              />
            )}
          </Box>
        </Flex>
        <Box
          h="full"
          px={{ base: 1, md: 0 }}
          py={{ base: 2, md: 0 }}
          borderBottomWidth={{ base: 2, md: 0 }}
          borderBottomColor={{ base: "gray.100", md: "none" }}
          _dark={{
            borderBottomColor: { base: "gray.700", md: "none" },
          }}
        >
          <Flex w="full" justifyContent="end">
            <HStack
              spacing={1}
              height="24px"
              justifyContent={{ base: "space-between", md: "end" }}
              w="full"
            >
              <SetCreatorOnly fallback={<Box />}>
                <IconButton
                  size={{ base: "sm", md: undefined }}
                  transform={{ base: "scale(0.8)", md: "scale(1)" }}
                  icon={<IconEditCircle size={18} />}
                  variant={isEditing ? "solid" : "ghost"}
                  aria-label="Edit"
                  rounded="full"
                  onClick={() => {
                    if (isEditing) {
                      doEdit();
                    }
                    setIsEditing(!isEditing);
                  }}
                />
              </SetCreatorOnly>
              <IconButton
                size={{ base: "sm", md: undefined }}
                transform={{ base: "scale(0.8)", md: "scale(1)" }}
                icon={<Star size={18} />}
                variant="ghost"
                aria-label="Edit"
                rounded="full"
                onClick={() => {
                  if (!authed) {
                    menuEventChannel.emit("openSignup", {
                      message:
                        "Create an account for free to customize and star terms",
                    });
                    return;
                  }

                  if (!starred) {
                    starTerm(term.id);
                    starMutation.mutate({
                      termId: term.id,
                      containerId: container!.id,
                    });
                  } else {
                    unstarTerm(term.id);
                    unstarMutation.mutate({
                      termId: term.id,
                    });
                  }
                }}
              />
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export const DisplayableTermPure = React.memo(DisplayableTerm);
