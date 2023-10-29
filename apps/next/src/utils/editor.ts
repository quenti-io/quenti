import type { JSONContent } from "@tiptap/react";

export const getPlainText = (json: JSONContent): string => {
  return json.content
    ? json.content
        .map((node) => {
          if (node.type === "text") return node.text;
          if (node.type === "paragraph") return getPlainText(node);
          return "";
        })
        .join("\n")
    : "";
};

export const plainTextToHtml = (text: string): string => {
  // Split by newlines and make each line a paragraph
  const paragraphs = text.split("\n").map((line) => `<p>${line}</p>`);
  return paragraphs.join("");
};
