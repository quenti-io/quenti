import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import { type useEditor } from "@tiptap/react";

import { EmojiReplacer } from "./extensions/emoji-replacer";

const grayBorder = "border-b-[var(--chakra-colors-gray-200)]";
const darkGrayBorder = "dark:border-b-[var(--chakra-colors-gray-600)]";
const blueBorder = "focus:border-b-[var(--chakra-colors-blue-300)]";
const darkBlueBorder = "dark:focus:border-b-[var(--chakra-colors-blue-300)]";
const boxShadow =
  "focus:shadow-[0px_1px_0px_0px_var(--chakra-colors-blue-300)]";

export const editorConfig = (
  tabIndex?: number,
): Parameters<typeof useEditor>[0] => ({
  extensions: [Document, Paragraph, Text, Typography, EmojiReplacer],
  editorProps: {
    attributes: {
      class: `focus:outline-none py-[7px] border-b-[1px] transition-[border,box-shadow] ${grayBorder} ${darkGrayBorder} ${blueBorder} ${darkBlueBorder} ${boxShadow}`,
      ...(tabIndex !== undefined ? { tabIndex: `${tabIndex}` } : {}),
    },
  },
});
