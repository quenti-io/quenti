import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { generateJSON } from "@tiptap/html";

export const getRichTextJSON = (html: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  return generateJSON(html, [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Strike,
    Underline,
    Highlight,
  ]);
};
