import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import type { Extension, useEditor } from "@tiptap/react";

import { HighlightExtension } from "@quenti/lib/editor";

import { EmojiReplacer } from "./extensions/emoji-replacer";

const grayBorder = "border-b-[var(--chakra-colors-gray-200)]";
const darkGrayBorder = "dark:border-b-[var(--chakra-colors-gray-600)]";
const blueBorder = "focus:border-b-[var(--chakra-colors-blue-300)]";
const darkBlueBorder = "dark:focus:border-b-[var(--chakra-colors-blue-300)]";
const boxShadow =
  "focus:shadow-[0px_1px_0px_0px_var(--chakra-colors-blue-300)]";

export const editorAttributes = (tabIndex?: number) => ({
  class: `focus:outline-none py-[7px] border-b-[1px] transition-[border,box-shadow] ${grayBorder} ${darkGrayBorder} ${blueBorder} ${darkBlueBorder} ${boxShadow}`,
  ...(tabIndex !== undefined ? { tabindex: `${tabIndex}` } : {}),
});

export const editorConfig = (
  tabIndex?: number,
  extensions?: Extension[],
): Parameters<typeof useEditor>[0] => ({
  extensions: [
    Document,
    Paragraph,
    Text,
    Typography,
    Bold,
    Italic,
    Strike,
    Underline,
    HighlightExtension.configure({
      multicolor: true,
    }),
    EmojiReplacer,
    History.configure({
      depth: 20,
    }),
    ...(extensions || []),
  ],
  editorProps: {
    attributes: editorAttributes(tabIndex),
  },
});
