import type { JSONContent } from "@tiptap/react";
import React from "react";
import { FilterXSS, escapeAttrValue, getDefaultWhiteList } from "xss";

import { richTextToHtml } from "@quenti/lib/editor";
import type { Prisma } from "@quenti/prisma/client";

import { ScriptFormatter } from "./script-formatter";

const whitelist = getDefaultWhiteList();
// Style attribute should still be safe from xss, just saves compute time on other elements
whitelist.mark?.push("style");

const xss = new FilterXSS({
  whiteList: whitelist,
  onIgnoreTagAttr: function (_tag, name, value) {
    if (name.substring(0, 5) === "data-") {
      return `${name}="${escapeAttrValue(value)}"`;
    }
  },
});

export const Display: React.FC<{
  text: string;
  richText?: Prisma.JsonValue | JSON | JSONContent;
}> = ({ text, richText }) => {
  return richText ? (
    <p
      dangerouslySetInnerHTML={{
        __html: xss.process(richTextToHtml(richText as JSONContent, true)),
      }}
    />
  ) : (
    <ScriptFormatter>{text}</ScriptFormatter>
  );
};
