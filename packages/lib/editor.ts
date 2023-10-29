import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";

export const SERIALIZABLE_EXTENSIONS = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Strike,
  Underline,
  Highlight,
];

export const getPlainText = (json: JSONContent, delimeter = "\n"): string => {
  return (
    json.content
      ?.map((node) => {
        if (node.type === "text" && node.text) {
          return node.text;
        }
        if (node.type === "paragraph") {
          return getPlainText(node, "");
        }
        return "";
      })
      .join(delimeter) || ""
  );
};

export const plainTextToHtml = (text: string): string => {
  // Split by newlines and make each line a paragraph
  const paragraphs = text.split("\n").map((line) => `<p>${line}</p>`);
  return paragraphs.join("");
};

export const richTextToHtml = (json: JSONContent, breaks = false): string => {
  const raw = generateHTML(json, SERIALIZABLE_EXTENSIONS);
  if (!breaks) return raw;
  // Replace empty paragraphs with breaks
  return raw.replace(/<p><\/p>/g, "<p><br></p>");
};

export const getRichTextJson = (html: string) => {
  return generateJSON(html, SERIALIZABLE_EXTENSIONS) as JSON;
};

export const hasRichText = (json: JSONContent, plainText: string): boolean => {
  const plainHtml = plainTextToHtml(plainText);
  const richHtml = richTextToHtml(json);
  return plainHtml != richHtml;
};

export const editorInput = (
  term: {
    word: string;
    definition: string;
    wordRichText?: JSON | null;
    definitionRichText?: JSON | null;
  },
  type: "word" | "definition",
) => {
  if (type == "word") {
    return term.wordRichText ?? plainTextToHtml(term.word);
  } else {
    return term.definitionRichText ?? plainTextToHtml(term.definition);
  }
};
